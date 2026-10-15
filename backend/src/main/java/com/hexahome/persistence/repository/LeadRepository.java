package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {

    Page<Lead> findAllByPropertyIdOrderByCreatedAtDesc(UUID propertyId, Pageable pageable);

    Page<Lead> findAllBySeekerIdOrderByCreatedAtDesc(UUID seekerId, Pageable pageable);

    @Query("SELECT l FROM Lead l WHERE l.property.owner.id = :ownerId ORDER BY l.createdAt DESC")
    Page<Lead> findAllByOwnerId(@Param("ownerId") UUID ownerId, Pageable pageable);

    long countBySeekerId(UUID seekerId);
}
