package com.hexahome.application.service.impl;

import com.hexahome.application.dto.content.FaqDto;
import com.hexahome.persistence.entity.Faq;
import com.hexahome.persistence.repository.FaqRepository;
import com.hexahome.application.service.FaqService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FaqServiceImpl implements FaqService {

    private final FaqRepository faqRepository;

    public FaqServiceImpl(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaqDto> getFaqs(String category) {
        List<Faq> faqs = (category != null && !category.isBlank())
                ? faqRepository.findAllByCategoryIgnoreCaseOrderByDisplayOrderAsc(category)
                : faqRepository.findAllByOrderByDisplayOrderAsc();

        return faqs.stream()
                .map(FaqDto::fromEntity)
                .toList();
    }
}
