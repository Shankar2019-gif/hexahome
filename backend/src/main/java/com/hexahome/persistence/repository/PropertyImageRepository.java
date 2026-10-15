package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, UUID> {
    List<PropertyImage> findAllByPropertyIdOrderByDisplayOrderAsc(UUID propertyId);
    Optional<PropertyImage> findByImageUrl(String imageUrl);
    List<PropertyImage> findAllByImageUrlOrThumbnailUrl(String imageUrl, String thumbnailUrl);
}
