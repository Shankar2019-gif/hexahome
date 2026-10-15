package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.SavedSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedSearchRepository extends JpaRepository<SavedSearch, UUID> {

    List<SavedSearch> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<SavedSearch> findByIdAndUserId(UUID id, UUID userId);
}
