package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID>, JpaSpecificationExecutor<Subscription> {
    Optional<Subscription> findTopByUserIdAndStatusOrderByExpiresAtDesc(UUID userId, String status);
    List<Subscription> findAllByUserIdOrderByStartsAtDesc(UUID userId);
}
