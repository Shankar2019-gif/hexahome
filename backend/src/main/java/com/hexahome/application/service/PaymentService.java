package com.hexahome.application.service;

import com.hexahome.application.dto.billing.CreateOrderRequest;
import com.hexahome.application.dto.billing.OrderResponseDto;
import com.hexahome.application.dto.billing.PaymentHistoryDto;
import com.hexahome.application.dto.billing.PaymentVerificationResponseDto;
import com.hexahome.application.dto.billing.VerifyPaymentRequest;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    OrderResponseDto createOrder(UUID userId, CreateOrderRequest request);

    PaymentVerificationResponseDto verifyPayment(UUID userId, VerifyPaymentRequest request);

    void handleWebhookEvent(String rawPayload, String signature);

    List<PaymentHistoryDto> getUserPaymentHistory(UUID userId);
}
