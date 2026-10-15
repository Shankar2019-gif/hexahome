package com.hexahome.application.service;

import com.hexahome.domain.exception.BadRequestException;
import com.hexahome.domain.exception.RateLimitExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final int RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes
    private static final int MAX_REQUESTS_PER_WINDOW = 3;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    // Concurrent in-memory store for active OTP entries
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    
    // Concurrent store for rate limiting: phone -> RateLimitEntry
    private final ConcurrentHashMap<String, RateLimitEntry> rateLimitStore = new ConcurrentHashMap<>();

    public OtpService() {
    }

    private static class OtpEntry {
        final String otp;
        final Instant expiresAt;

        OtpEntry(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private static class RateLimitEntry {
        int requestCount;
        Instant windowResetAt;

        RateLimitEntry(int requestCount, Instant windowResetAt) {
            this.requestCount = requestCount;
            this.windowResetAt = windowResetAt;
        }
    }

    public String generateAndSendOtp(String phone) {
        checkRateLimit(phone);

        // Always generate a genuine cryptographically secure 6-digit random OTP
        int randomNum = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(randomNum);

        Instant expiresAt = Instant.now().plusSeconds(OTP_VALIDITY_SECONDS);
        otpStore.put(phone, new OtpEntry(otp, expiresAt));

        log.info("==================================================================");
        log.info(">> [HEXAHOME AUTH] Dispatching OTP for phone +91-{}: {}", phone, otp);
        log.info(">> Valid for {} seconds until {}", OTP_VALIDITY_SECONDS, expiresAt);
        log.info("==================================================================");

        return otp;
    }

    public boolean verifyOtp(String phone, String inputOtp) {
        OtpEntry entry = otpStore.get(phone);
        if (entry == null) {
            throw new BadRequestException("No active OTP found for phone +91-" + phone + ". Please request a new OTP.");
        }

        if (Instant.now().isAfter(entry.expiresAt)) {
            otpStore.remove(phone);
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!entry.otp.equals(inputOtp)) {
            throw new BadRequestException("Invalid OTP entered. Please check your SMS and try again.");
        }

        // OTP is valid - invalidate immediately to prevent replay
        otpStore.remove(phone);
        return true;
    }

    private void checkRateLimit(String phone) {
        Instant now = Instant.now();
        rateLimitStore.compute(phone, (key, existing) -> {
            if (existing == null || now.isAfter(existing.windowResetAt)) {
                return new RateLimitEntry(1, now.plusSeconds(RATE_LIMIT_WINDOW_SECONDS));
            }

            if (existing.requestCount >= MAX_REQUESTS_PER_WINDOW) {
                long waitMinutes = (existing.windowResetAt.getEpochSecond() - now.getEpochSecond()) / 60 + 1;
                throw new RateLimitExceededException(
                        String.format("Too many OTP requests for phone %s. Please wait %d minutes before trying again.", phone, waitMinutes)
                );
            }

            existing.requestCount++;
            return existing;
        });
    }

    public int getOtpValiditySeconds() {
        return OTP_VALIDITY_SECONDS;
    }
}
