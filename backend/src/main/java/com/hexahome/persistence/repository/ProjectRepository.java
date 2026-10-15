package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Optional<Project> findBySlug(String slug);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.city LEFT JOIN FETCH p.locality WHERE p.isFeatured = true ORDER BY p.createdAt DESC")
    List<Project> findAllFeaturedProjects();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.city LEFT JOIN FETCH p.locality ORDER BY p.createdAt DESC")
    List<Project> findAllWithDetails();

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.city c LEFT JOIN FETCH p.locality WHERE LOWER(c.slug) = LOWER(:citySlug) ORDER BY p.createdAt DESC")
    List<Project> findAllByCitySlug(@Param("citySlug") String citySlug);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.city LEFT JOIN FETCH p.locality WHERE LOWER(p.status) = LOWER(:status) ORDER BY p.createdAt DESC")
    List<Project> findAllByStatus(@Param("status") String status);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.city c LEFT JOIN FETCH p.locality WHERE LOWER(c.slug) = LOWER(:citySlug) AND LOWER(p.status) = LOWER(:status) ORDER BY p.createdAt DESC")
    List<Project> findAllByCitySlugAndStatus(@Param("citySlug") String citySlug, @Param("status") String status);
}

