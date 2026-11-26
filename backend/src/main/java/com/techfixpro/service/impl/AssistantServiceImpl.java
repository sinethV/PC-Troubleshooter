package com.techfixpro.service.impl;

import com.techfixpro.dto.assistant.AssistantAnswerDto;
import com.techfixpro.entity.Command;
import com.techfixpro.entity.TroubleshootingGuide;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.TroubleshootingGuideRepository;
import com.techfixpro.service.AssistantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Deterministic, offline "assistant" that ranks the technician's own library
 * against a free-text problem description. No external model, no invented data:
 * every result is a real command or guide row with a visible match reason.
 */
@Service
@Transactional(readOnly = true)
public class AssistantServiceImpl implements AssistantService {

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "the", "and", "for", "are", "but", "not", "you", "your", "with", "this", "that",
            "from", "have", "has", "was", "were", "will", "would", "can", "cant", "cannot",
            "does", "doesnt", "did", "didnt", "why", "how", "what", "when", "where", "who",
            "its", "it's", "my", "me", "i", "im", "i'm", "is", "am", "be", "been", "being",
            "on", "in", "at", "to", "of", "or", "as", "by", "an", "a", "do", "so", "if",
            "get", "got", "keep", "keeps", "very", "too", "just", "now", "then", "there",
            "computer", "laptop", "desktop", "machine", "system", "please", "help", "fix",
            "problem", "issue", "error", "errors", "when", "after", "before", "every", "all",
            "some", "any", "out", "up", "down", "off", "still", "again", "randomly"
    ));

    private static final Map<String, String> TOPIC_HINTS = new LinkedHashMap<>();

    /** A single weak keyword hit is not enough to recommend a command or guide. */
    private static final double MIN_SCORE = 5.0;

    static {
        TOPIC_HINTS.put("bsod", "Blue screen / BSOD");
        TOPIC_HINTS.put("slow", "Slow performance");
        TOPIC_HINTS.put("wifi", "Wi-Fi or network connectivity");
        TOPIC_HINTS.put("dns", "DNS resolution failures");
        TOPIC_HINTS.put("disk", "Disk health and storage");
        TOPIC_HINTS.put("update", "Windows Update failures");
        TOPIC_HINTS.put("printer", "Printer and spooler problems");
        TOPIC_HINTS.put("boot", "Boot or startup failures");
        TOPIC_HINTS.put("defender", "Security and malware");
        TOPIC_HINTS.put("domain", "Active Directory and domain join");
        TOPIC_HINTS.put("linux", "Linux administration");
        TOPIC_HINTS.put("driver", "Driver problems");
    }

    private final CommandRepository commandRepository;
    private final TroubleshootingGuideRepository guideRepository;

    public AssistantServiceImpl(CommandRepository commandRepository,
                                TroubleshootingGuideRepository guideRepository) {
        this.commandRepository = commandRepository;
        this.guideRepository = guideRepository;
    }

    @Override
    public AssistantAnswerDto ask(String question) {
        String query = question == null ? "" : question.trim();
        AssistantAnswerDto answer = new AssistantAnswerDto();
        answer.setQuery(query);
        answer.setLlmConfigured(System.getenv("TECHFIX_LLM_API_KEY") != null);

        List<String> terms = tokenize(query);
        answer.setMatchedTerms(terms);

        if (terms.isEmpty()) {
            answer.setSummary("Describe the symptom you are seeing, for example: \"Wi-Fi keeps disconnecting\" or \"blue screen after update\".");
            answer.setSuggestions(new ArrayList<>(TOPIC_HINTS.values()));
            return answer;
        }

        List<AssistantAnswerDto.CommandMatch> commands = scoreCommands(terms, query);
        String dominantCategory = commands.isEmpty() ? null : commands.get(0).getCategoryName();
        List<AssistantAnswerDto.GuideMatch> guides = scoreGuides(terms, query, dominantCategory);

        answer.setCommands(commands);
        answer.setGuides(guides);

        if (commands.isEmpty() && guides.isEmpty()) {
            answer.setSummary("No library entry matches \"" + query + "\" yet. Try a different wording or browse a topic below.");
            answer.setSuggestions(suggestTopics(terms));
        } else {
            answer.setSummary(String.format(Locale.ROOT,
                    "Found %d command%s and %d guide%s for \"%s\".",
                    commands.size(), commands.size() == 1 ? "" : "s",
                    guides.size(), guides.size() == 1 ? "" : "s",
                    query));
        }

        return answer;
    }

    private List<AssistantAnswerDto.CommandMatch> scoreCommands(List<String> terms, String rawQuery) {
        List<Command> all = commandRepository.findAll();
        List<ScoredCommand> scored = new ArrayList<>();

        String phrase = rawQuery.toLowerCase(Locale.ROOT).trim();

        for (Command command : all) {
            double score = 0;
            Set<String> hits = new LinkedHashSet<>();

            score += fieldScore(terms, command.getName(), 5, hits);
            score += fieldScore(terms, command.getWhenToUse(), 3, hits);
            score += fieldScore(terms, command.getPurpose(), 3, hits);
            score += fieldScore(terms, command.getExplanation(), 1, hits);
            score += fieldScore(terms, command.getCommandSyntax(), 2, hits);
            score += fieldScore(terms, command.getCategory() != null ? command.getCategory().getName() : null, 2, hits);

            if (phrase.length() >= 4) {
                if (contains(command.getName(), phrase)) score += 12;
                else if (contains(command.getWhenToUse(), phrase)) score += 8;
                else if (contains(command.getExplanation(), phrase)) score += 6;
            }

            if (score >= MIN_SCORE) {
                scored.add(new ScoredCommand(command, score, hits));
            }
        }

        scored.sort(Comparator.comparingDouble(ScoredCommand::score).reversed());
        double max = scored.isEmpty() ? 1 : scored.get(0).score();

        List<AssistantAnswerDto.CommandMatch> result = new ArrayList<>();
        for (ScoredCommand entry : scored.subList(0, Math.min(5, scored.size()))) {
            Command command = entry.command;
            AssistantAnswerDto.CommandMatch match = new AssistantAnswerDto.CommandMatch();
            match.setId(command.getId());
            match.setName(command.getName());
            match.setCommandSyntax(command.getCommandSyntax());
            match.setRiskLevel(command.getRiskLevel());
            match.setRequiredPermissions(command.getRequiredPermissions());
            match.setCategoryName(command.getCategory() != null ? command.getCategory().getName() : null);
            match.setPurpose(command.getPurpose());
            match.setWhenToUse(command.getWhenToUse());
            match.setScore(percent(entry.score, max));
            match.setWhy("matches: " + String.join(", ", entry.hits));
            result.add(match);
        }
        return result;
    }

    private List<AssistantAnswerDto.GuideMatch> scoreGuides(List<String> terms, String rawQuery, String dominantCategory) {
        List<TroubleshootingGuide> all = guideRepository.findAll();
        List<ScoredGuide> scored = new ArrayList<>();

        String phrase = rawQuery.toLowerCase(Locale.ROOT).trim();

        for (TroubleshootingGuide guide : all) {
            double score = 0;
            Set<String> hits = new LinkedHashSet<>();
            boolean phraseHit = false;

            score += fieldScore(terms, guide.getTitle(), 5, hits);
            score += fieldScore(terms, guide.getSymptoms(), 4, hits);
            score += fieldScore(terms, guide.getDescription(), 2, hits);
            score += fieldScore(terms, guide.getCategory() != null ? guide.getCategory().getName() : null, 2, hits);

            if (phrase.length() >= 4) {
                if (contains(guide.getTitle(), phrase)) {
                    score += 12;
                    phraseHit = true;
                } else if (contains(guide.getSymptoms(), phrase)) {
                    score += 9;
                    phraseHit = true;
                }
            }

            String guideCategory = guide.getCategory() != null ? guide.getCategory().getName() : null;
            boolean sameDomain = dominantCategory == null || dominantCategory.equals(guideCategory);
            boolean strongMatch = hits.size() >= 2 || phraseHit;

            // Never recommend an unrelated guide just because one generic word matched.
            if (score >= MIN_SCORE && (sameDomain || strongMatch)) {
                scored.add(new ScoredGuide(guide, score, hits));
            }
        }

        scored.sort(Comparator.comparingDouble(ScoredGuide::score).reversed());
        double max = scored.isEmpty() ? 1 : scored.get(0).score();

        List<AssistantAnswerDto.GuideMatch> result = new ArrayList<>();
        for (ScoredGuide entry : scored.subList(0, Math.min(3, scored.size()))) {
            TroubleshootingGuide guide = entry.guide;
            AssistantAnswerDto.GuideMatch match = new AssistantAnswerDto.GuideMatch();
            match.setId(guide.getId());
            match.setTitle(guide.getTitle());
            match.setDescription(guide.getDescription());
            match.setSymptoms(guide.getSymptoms());
            match.setDifficulty(guide.getDifficulty());
            match.setEstimatedTimeMinutes(guide.getEstimatedTimeMinutes());
            match.setCategoryName(guide.getCategory() != null ? guide.getCategory().getName() : null);
            match.setScore(percent(entry.score, max));
            match.setWhy("matches: " + String.join(", ", entry.hits));
            result.add(match);
        }
        return result;
    }

    private double fieldScore(List<String> terms, String text, double weight, Set<String> hits) {
        if (text == null || text.isBlank()) return 0;
        String lower = text.toLowerCase(Locale.ROOT);
        double score = 0;

        for (String term : terms) {
            int occurrences = countOccurrences(lower, term);
            if (occurrences > 0) {
                score += weight * Math.min(3, occurrences);
                hits.add(term);
            }
        }
        return score;
    }

    private int countOccurrences(String haystack, String needle) {
        int count = 0;
        int index = 0;
        while ((index = haystack.indexOf(needle, index)) >= 0) {
            count++;
            index += needle.length();
            if (count >= 3) break;
        }
        return count;
    }

    private boolean contains(String text, String phrase) {
        return text != null && text.toLowerCase(Locale.ROOT).contains(phrase);
    }

    private double percent(double score, double max) {
        if (max <= 0) return 0;
        return Math.round((score / max) * 1000.0) / 10.0;
    }

    private List<String> suggestTopics(List<String> terms) {
        List<String> suggestions = new ArrayList<>();
        for (String term : terms) {
            for (Map.Entry<String, String> hint : TOPIC_HINTS.entrySet()) {
                if (term.contains(hint.getKey()) || hint.getKey().contains(term)) {
                    suggestions.add(hint.getValue());
                }
            }
        }
        if (suggestions.isEmpty()) {
            suggestions.addAll(TOPIC_HINTS.values());
        }
        return suggestions;
    }

    static List<String> tokenize(String query) {
        if (query == null) return new ArrayList<>();
        String[] raw = query.toLowerCase(Locale.ROOT).split("[^a-z0-9]+");
        Set<String> terms = new LinkedHashSet<>();
        for (String token : raw) {
            if (token.length() < 2 || STOPWORDS.contains(token)) continue;
            String stem = stem(token);
            if (!STOPWORDS.contains(stem)) {
                terms.add(stem);
            }
        }
        return new ArrayList<>(terms);
    }

    /**
     * Very light suffix stripping so "disconnecting" matches "disconnects".
     * Deliberately simple: the goal is recall on technician phrasing, not NLP.
     */
    private static String stem(String token) {
        if (token.length() > 5 && token.endsWith("ing")) return token.substring(0, token.length() - 3);
        if (token.length() > 4 && token.endsWith("ed")) return token.substring(0, token.length() - 2);
        if (token.length() > 4 && token.endsWith("es")) return token.substring(0, token.length() - 2);
        if (token.length() > 4 && token.endsWith("s")) return token.substring(0, token.length() - 1);
        return token;
    }

    private static class ScoredCommand {
        final Command command;
        final double score;
        final Set<String> hits;

        ScoredCommand(Command command, double score, Set<String> hits) {
            this.command = command;
            this.score = score;
            this.hits = hits;
        }

        double score() { return score; }
    }

    private static class ScoredGuide {
        final TroubleshootingGuide guide;
        final double score;
        final Set<String> hits;

        ScoredGuide(TroubleshootingGuide guide, double score, Set<String> hits) {
            this.guide = guide;
            this.score = score;
            this.hits = hits;
        }

        double score() { return score; }
    }
}
