package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<User> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:identifier) OR u.phone = :identifier OR LOWER(u.name) = LOWER(:identifier)")
    Optional<User> findByIdentifier(@org.springframework.data.repository.query.Param("identifier") String identifier);
}
