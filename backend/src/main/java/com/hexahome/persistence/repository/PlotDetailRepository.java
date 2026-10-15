package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.PlotDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlotDetailRepository extends JpaRepository<PlotDetail, UUID> {
    Optional<PlotDetail> findByPropertyId(UUID propertyId);
}
