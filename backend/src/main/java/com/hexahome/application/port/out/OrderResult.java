package com.hexahome.application.port.out;

import java.math.BigDecimal;

public record OrderResult(
        String orderId,
        BigDecimal amount,
        String currency,
        String gateway,
        String keyId
) {}
