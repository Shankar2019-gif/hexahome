package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.ContactView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactViewRepository extends JpaRepository<ContactView, UUID> {
    boolean existsByUserIdAndPropertyId(UUID userId, UUID propertyId);
    Optional<ContactView> findByUserIdAndPropertyId(UUID userId, UUID propertyId);
    long countByUserId(UUID userId);
}
