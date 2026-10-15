package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Integer> {

    List<Amenity> findAllByOrderByCategoryAscNameAsc();

    List<Amenity> findAllByCategoryIgnoreCaseOrderByNameAsc(String category);

    Optional<Amenity> findByCode(String code);
}
