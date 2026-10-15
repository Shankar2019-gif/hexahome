package com.hexahome.persistence.repository;

import com.hexahome.persistence.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Integer> {

    List<Faq> findAllByOrderByDisplayOrderAsc();

    List<Faq> findAllByCategoryIgnoreCaseOrderByDisplayOrderAsc(String category);
}
