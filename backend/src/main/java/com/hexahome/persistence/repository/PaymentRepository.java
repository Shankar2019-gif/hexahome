package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID>, JpaSpecificationExecutor<Payment> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByPaymentId(String paymentId);
    List<Payment> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT p FROM Payment p LEFT JOIN FETCH p.subscription s LEFT JOIN FETCH s.plan WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findAllByUserIdWithDetails(@Param("userId") UUID userId);
}

