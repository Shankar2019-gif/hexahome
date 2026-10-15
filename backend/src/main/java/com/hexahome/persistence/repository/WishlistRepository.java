package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    boolean existsByUserIdAndPropertyId(UUID userId, UUID propertyId);

    Optional<Wishlist> findByUserIdAndPropertyId(UUID userId, UUID propertyId);

    void deleteByUserIdAndPropertyId(UUID userId, UUID propertyId);

    @Query(
            value = "SELECT w FROM Wishlist w JOIN FETCH w.property p LEFT JOIN FETCH p.city LEFT JOIN FETCH p.locality WHERE w.user.id = :userId ORDER BY w.createdAt DESC",
            countQuery = "SELECT count(w) FROM Wishlist w WHERE w.user.id = :userId"
    )
    Page<Wishlist> findAllByUserIdWithDetails(@Param("userId") UUID userId, Pageable pageable);

    long countByPropertyId(UUID propertyId);
}
