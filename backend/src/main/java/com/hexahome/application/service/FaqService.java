package com.hexahome.application.service;

import com.hexahome.application.dto.content.FaqDto;

import java.util.List;

public interface FaqService {

    List<FaqDto> getFaqs(String category);
}
