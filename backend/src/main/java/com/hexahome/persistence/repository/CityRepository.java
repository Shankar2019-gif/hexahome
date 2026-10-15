package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {

    List<City> findAllByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<City> findBySlug(String slug);

    Optional<City> findByNameIgnoreCase(String name);

    @Query(value = "SELECT COUNT(*) FROM properties WHERE city_id = :cityId AND status = 'ACTIVE'", nativeQuery = true)
    long countActivePropertiesByCityId(@Param("cityId") Integer cityId);
}
