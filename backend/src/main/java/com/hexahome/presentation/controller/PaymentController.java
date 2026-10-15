package com.hexahome.presentation.controller;

import com.hexahome.presentation.response.ApiResponse;
import com.hexahome.application.dto.billing.CreateOrderRequest;
import com.hexahome.application.dto.billing.OrderResponseDto;
import com.hexahome.application.dto.billing.PaymentHistoryDto;
import com.hexahome.application.dto.billing.PaymentVerificationResponseDto;
import com.hexahome.application.dto.billing.VerifyPaymentRequest;
import com.hexahome.infrastructure.security.UserPrincipal;
import com.hexahome.application.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments & Checkout", description = "Endpoints for initiating orders, verifying gateway signatures, and tracking payment history")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Initiate checkout payment order", description = "Generates a unique order ID and returns payload for checkout")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponseDto order = paymentService.createOrder(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Order created successfully", order), HttpStatus.CREATED);
    }

    @PostMapping("/verify")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Verify payment and activate credits", description = "Validates payment signature, marks payment SUCCESS, and tops up contact reveal credits")
    public ResponseEntity<ApiResponse<PaymentVerificationResponseDto>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VerifyPaymentRequest request) {
        PaymentVerificationResponseDto verification = paymentService.verifyPayment(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and subscription activated successfully", verification));
    }

    @GetMapping("/history")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get user payment transaction history", description = "Returns chronological list of all payments initiated by the authenticated user")
    public ResponseEntity<ApiResponse<List<PaymentHistoryDto>>> getPaymentHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<PaymentHistoryDto> history = paymentService.getUserPaymentHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved successfully", history));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Handle Razorpay payment webhook notifications", description = "Validates X-Razorpay-Signature and reconciles payment status")
    public ResponseEntity<ApiResponse<String>> handleWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody String rawPayload) {
        paymentService.handleWebhookEvent(rawPayload, signature);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", "OK"));
    }
}

