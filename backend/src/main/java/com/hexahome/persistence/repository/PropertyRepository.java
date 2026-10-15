package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {

    Optional<Property> findBySlug(String slug);

    Optional<Property> findByShortId(String shortId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality", "owner"})
    @Query("SELECT p FROM Property p WHERE p.slug = :identifier OR p.shortId = :identifier")
    Optional<Property> findBySlugOrShortId(@Param("identifier") String identifier);

    @Override
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality"})
    Page<Property> findAll(org.springframework.data.jpa.domain.Specification<Property> spec, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality"})
    @Query("SELECT p FROM Property p WHERE LOWER(p.city.slug) = LOWER(:citySlug) AND UPPER(p.adType) = UPPER(:adType) AND p.status = :status")
    Page<Property> findAllByCitySlugAndAdTypeAndStatus(
            @Param("citySlug") String citySlug,
            @Param("adType") String adType,
            @Param("status") String status,
            Pageable pageable
    );

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality"})
    @Query("SELECT p FROM Property p WHERE p.status = :status AND p.isHotDeal = true")
    Page<Property> findAllByStatusAndIsHotDealTrue(@Param("status") String status, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality"})
    @Query("SELECT p FROM Property p WHERE LOWER(p.city.slug) = LOWER(:citySlug) AND UPPER(p.adType) = UPPER(:adType) AND p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    List<Property> findFeaturedByCityAndAdType(
            @Param("citySlug") String citySlug,
            @Param("adType") String adType,
            Pageable pageable
    );

    long countByStatus(String status);

    long countByOwnerId(UUID ownerId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"city", "locality"})
    Page<Property> findByOwnerId(UUID ownerId, Pageable pageable);
}
