package com.hexahome.application.service;

import com.hexahome.application.dto.billing.PlanDto;
import com.hexahome.application.dto.billing.UserSubscriptionDto;

import java.util.List;
import java.util.UUID;

public interface SubscriptionService {

    List<PlanDto> getAllActivePlans();

    List<PlanDto> getPlansByTargetRole(String targetRole);

    PlanDto getPlanById(String planId);

    UserSubscriptionDto getCurrentUserSubscription(UUID userId);
}
