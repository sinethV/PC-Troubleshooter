package com.techfixpro.service;

import com.techfixpro.dto.assistant.AssistantAnswerDto;

public interface AssistantService {

    AssistantAnswerDto ask(String question);
}
