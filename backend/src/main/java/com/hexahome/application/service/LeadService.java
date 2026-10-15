package com.hexahome.application.service;

import com.hexahome.domain.exception.QuotaExhaustedException;
import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.lead.ContactRevealResponseDto;
import com.hexahome.application.dto.lead.CreateLeadRequest;
import com.hexahome.application.dto.lead.LeadResponseDto;
import com.hexahome.persistence.entity.*;
import com.hexahome.persistence.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class LeadService implements com.hexahome.application.port.in.LeadUseCase {

    private static final Logger log = LoggerFactory.getLogger(LeadService.class);

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ContactViewRepository contactViewRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;

    public LeadService(
            LeadRepository leadRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository,
            ContactViewRepository contactViewRepository,
            SubscriptionRepository subscriptionRepository,
            PlanRepository planRepository) {
        this.leadRepository = leadRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.contactViewRepository = contactViewRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
    }

    @Transactional
    public LeadResponseDto createLead(UUID seekerId, CreateLeadRequest request) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));

        User seeker = null;
        if (seekerId != null) {
            seeker = userRepository.findById(seekerId).orElse(null);
        }

        Lead lead = new Lead(
                property,
                seeker,
                request.getSeekerName().trim(),
                request.getSeekerPhone().trim(),
                request.getMessage()
        );

        Lead saved = leadRepository.save(lead);
        log.info("New lead submitted for property {} by seeker {}", property.getShortId(), lead.getSeekerPhone());
        return LeadResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<LeadResponseDto> getOwnerLeads(UUID ownerId, Pageable pageable) {
        return leadRepository.findAllByOwnerId(ownerId, pageable)
                .map(LeadResponseDto::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LeadResponseDto> getSeekerInquiries(UUID seekerId, Pageable pageable) {
        return leadRepository.findAllBySeekerIdOrderByCreatedAtDesc(seekerId, pageable)
                .map(LeadResponseDto::fromEntity);
    }

    @Transactional
    public ContactRevealResponseDto revealOwnerContact(UUID userId, UUID propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        User owner = property.getOwner();
        if (owner == null) {
            throw new ResourceNotFoundException("Owner not found for property " + propertyId);
        }

        // If the logged-in user is the property owner themselves
        if (user.getId().equals(owner.getId())) {
            return new ContactRevealResponseDto(
                    property.getId(),
                    property.getTitle(),
                    owner.getName(),
                    owner.getPhone(),
                    owner.getEmail(),
                    true,
                    0,
                    999,
                    Instant.now()
            );
        }

        // 1. Check idempotency: Has user already revealed this property's contact?
        Optional<ContactView> existingView = contactViewRepository.findByUserIdAndPropertyId(userId, propertyId);
        if (existingView.isPresent()) {
            int remaining = getActiveRemainingCredits(userId);
            return new ContactRevealResponseDto(
                    property.getId(),
                    property.getTitle(),
                    owner.getName(),
                    owner.getPhone(),
                    owner.getEmail(),
                    true,
                    0,
                    remaining,
                    existingView.get().getViewedAt()
            );
        }

        // 2. Fetch or provision active subscription
        Subscription subscription = getOrProvisionSubscription(user);

        if (subscription.getRemainingCredits() <= 0) {
            throw new QuotaExhaustedException("You have exhausted all your contact reveal credits (0 remaining). Please upgrade your subscription plan to unlock more owner contacts.");
        }

        // 3. Deduct credit
        subscription.setRemainingCredits(subscription.getRemainingCredits() - 1);
        subscriptionRepository.save(subscription);

        // 4. Record audit log in contact_views
        ContactView view = new ContactView(user, property, 1);
        ContactView savedView = contactViewRepository.save(view);

        // 5. Log a lead inquiry record for the property owner
        String seekerName = (user.getName() != null && !user.getName().isBlank())
                ? user.getName() : "Interested Buyer/Tenant";
        String seekerPhone = user.getPhone() != null ? user.getPhone() : "N/A";
        Lead lead = new Lead(
                property,
                user,
                seekerName,
                seekerPhone,
                "Seeker unlocked owner contact details for property: " + property.getTitle()
        );
        leadRepository.save(lead);

        log.info("Owner contact revealed for property {} to user {}. Remaining credits: {}",
                property.getShortId(), user.getPhone(), subscription.getRemainingCredits());

        return new ContactRevealResponseDto(
                property.getId(),
                property.getTitle(),
                owner.getName(),
                owner.getPhone(),
                owner.getEmail(),
                false,
                1,
                subscription.getRemainingCredits(),
                savedView.getViewedAt()
        );
    }

    private int getActiveRemainingCredits(UUID userId) {
        return subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(userId, "ACTIVE")
                .filter(s -> !s.isExpired())
                .map(Subscription::getRemainingCredits)
                .orElse(0);
    }

    private Subscription getOrProvisionSubscription(User user) {
        Optional<Subscription> activeSub = subscriptionRepository.findTopByUserIdAndStatusOrderByExpiresAtDesc(user.getId(), "ACTIVE");

        if (activeSub.isPresent() && !activeSub.get().isExpired()) {
            return activeSub.get();
        }

        // Auto-provision initial Free Tenant plan if no subscription has ever been created for this user
        Plan freePlan = planRepository.findById("plan_free_tenant")
                .orElseGet(() -> planRepository.save(new Plan("plan_free_tenant", "Basic Free", "TENANT", java.math.BigDecimal.ZERO, 30, 2)));

        Instant now = Instant.now();
        Instant expiresAt = now.plus(freePlan.getValidityDays(), ChronoUnit.DAYS);

        Subscription newSub = new Subscription(
                user,
                freePlan,
                freePlan.getContactCredits(),
                freePlan.getContactCredits(),
                now,
                expiresAt
        );

        return subscriptionRepository.save(newSub);
    }
}
