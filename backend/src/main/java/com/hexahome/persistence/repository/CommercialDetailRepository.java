package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.CommercialDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommercialDetailRepository extends JpaRepository<CommercialDetail, UUID> {
    Optional<CommercialDetail> findByPropertyId(UUID propertyId);
}
