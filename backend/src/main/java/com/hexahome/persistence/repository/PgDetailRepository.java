package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.PgDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PgDetailRepository extends JpaRepository<PgDetail, UUID> {
    Optional<PgDetail> findByPropertyId(UUID propertyId);
}
