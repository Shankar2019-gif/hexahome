package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.content.FaqDto;
import com.hexahome.application.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faqs")
@Tag(name = "Platform FAQs", description = "Endpoints for platform knowledge base, questions, and customer support")
public class FaqController {

    private final FaqService faqService;

    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    @GetMapping
    @Operation(summary = "List FAQs", description = "Retrieves platform FAQs optionally filtered by category (GENERAL, TENANT, OWNER, PAYMENT)")
    public ResponseEntity<ApiResponse<List<FaqDto>>> getFaqs(
            @RequestParam(required = false) String category) {
        List<FaqDto> faqs = faqService.getFaqs(category);
        return ResponseEntity.ok(ApiResponse.success("FAQs retrieved successfully", faqs));
    }
}
