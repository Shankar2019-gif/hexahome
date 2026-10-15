package com.hexahome.application.service;

import com.hexahome.application.dto.meta.AmenityDto;
import com.hexahome.persistence.repository.AmenityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MetaService {

    private final AmenityRepository amenityRepository;

    public MetaService(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Transactional(readOnly = true)
    public List<AmenityDto> getAllAmenities() {
        return amenityRepository.findAllByOrderByCategoryAscNameAsc()
                .stream()
                .map(AmenityDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmenityDto> getAmenitiesByCategory(String category) {
        return amenityRepository.findAllByCategoryIgnoreCaseOrderByNameAsc(category)
                .stream()
                .map(AmenityDto::fromEntity)
                .collect(Collectors.toList());
    }
}
