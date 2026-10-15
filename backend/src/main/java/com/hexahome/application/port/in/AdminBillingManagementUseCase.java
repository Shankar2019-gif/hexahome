package com.hexahome.application.port.in;

import com.hexahome.application.dto.admin.billing.*;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AdminBillingManagementUseCase {

    Page<AdminSubscriptionSummaryDto> searchSubscriptions(AdminSubscriptionFilterRequest request);

    AdminSubscriptionDetailDto getSubscriptionDetail(UUID subscriptionId);

    void extendSubscription(UUID subscriptionId, ExtendSubscriptionRequest request, UUID adminId, String ipAddress);

    void cancelSubscription(UUID subscriptionId, CancelSubscriptionRequest request, UUID adminId, String ipAddress);

    void manualGrantCredits(UUID subscriptionId, ManualGrantCreditsRequest request, UUID adminId, String ipAddress);

    Page<AdminPaymentSummaryDto> searchPayments(AdminPaymentFilterRequest request);
}
