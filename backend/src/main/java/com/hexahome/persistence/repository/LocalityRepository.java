package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Locality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Integer> {

    List<Locality> findAllByCityIdOrderByDisplayOrderAsc(Integer cityId);

    @Query("SELECT l FROM Locality l JOIN FETCH l.city WHERE l.city.slug = :citySlug ORDER BY l.displayOrder ASC")
    List<Locality> findAllByCitySlugOrderByDisplayOrderAsc(@Param("citySlug") String citySlug);

    Optional<Locality> findByCityIdAndSlug(Integer cityId, String slug);

    Optional<Locality> findByCityIdAndNameIgnoreCase(Integer cityId, String name);

    @Query(value = "SELECT COUNT(*) FROM properties WHERE locality_id = :localityId AND status = 'ACTIVE'", nativeQuery = true)
    long countActivePropertiesByLocalityId(@Param("localityId") Integer localityId);
}
