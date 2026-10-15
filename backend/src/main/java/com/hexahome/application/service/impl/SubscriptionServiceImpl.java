package com.hexahome.application.service.impl;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.billing.PlanDto;
import com.hexahome.application.dto.billing.UserSubscriptionDto;
import com.hexahome.persistence.entity.Plan;
import com.hexahome.persistence.entity.Subscription;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.PlanRepository;
import com.hexahome.persistence.repository.SubscriptionRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.application.service.SubscriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final PlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionServiceImpl(
            PlanRepository planRepository,
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository) {
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanDto> getAllActivePlans() {
        return planRepository.findAllByIsActiveTrue()
                .stream()
                .map(PlanDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanDto> getPlansByTargetRole(String targetRole) {
        String cleanRole = targetRole != null ? targetRole.trim().toUpperCase() : "TENANT";
        return planRepository.findAllByTargetRoleAndIsActiveTrue(cleanRole)
                .stream()
                .map(PlanDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlanDto getPlanById(String planId) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan", "id", planId));
        return PlanDto.fromEntity(plan);
    }

    @Override
    @Transactional
    public UserSubscriptionDto getCurrentUserSubscription(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<Subscription> activeSub = subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(userId, "ACTIVE");

        if (activeSub.isPresent() && !activeSub.get().isExpired()) {
            return UserSubscriptionDto.fromEntity(activeSub.get());
        }

        // Auto-provision initial free trial subscription if none active
        Plan freePlan = planRepository.findById("plan_free_tenant")
                .orElseGet(() -> planRepository.save(new Plan("plan_free_tenant", "Basic Free", "TENANT", java.math.BigDecimal.ZERO, 30, 2)));

        Instant now = Instant.now();
        Subscription newSub = new Subscription(
                user,
                freePlan,
                freePlan.getContactCredits(),
                freePlan.getContactCredits(),
                now,
                now.plus(freePlan.getValidityDays(), ChronoUnit.DAYS)
        );

        Subscription saved = subscriptionRepository.save(newSub);
        return UserSubscriptionDto.fromEntity(saved);
    }
}
