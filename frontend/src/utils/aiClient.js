const STORAGE_KEY = 'techfix.ai.config';

const DEFAULT_CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  apiKey: '',
};

export function getAiConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveAiConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_CONFIG, ...config }));
}

export function clearAiConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAiConfigured() {
  const { apiKey, baseUrl, model } = getAiConfig();
  return Boolean(apiKey && baseUrl && model);
}

/**
 * Optional conversational layer. Sends the user's own key directly from the
 * browser to an OpenAI-compatible endpoint. The built-in knowledge base works
 * without this and remains the default.
 */
export async function askLlm({ question, context }) {
  const { baseUrl, model, apiKey } = getAiConfig();
  if (!apiKey) throw new Error('No API key configured. Add one in Settings.');

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are an IT support assistant inside a technician toolkit. ' +
            'Answer using the provided library context first. Never invent commands or risk levels. ' +
            'If the context is insufficient, say so and suggest what to check. ' +
            'Reply with short numbered steps, mention required permissions and risk, and keep it under 250 words.',
        },
        {
          role: 'user',
          content: `Problem: ${question}\n\nLibrary context:\n${context}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Provider returned ${response.status}. ${detail.slice(0, 200)}`);
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (!answer) throw new Error('The provider returned an empty response.');
  return answer.trim();
}
