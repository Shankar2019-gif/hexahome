package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, String> {
    List<Plan> findAllByIsActiveTrue();
    List<Plan> findAllByTargetRoleAndIsActiveTrue(String targetRole);
}
