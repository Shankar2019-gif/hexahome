package com.hexahome.application.service;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.location.CityDto;
import com.hexahome.application.dto.location.LocalityDto;
import com.hexahome.persistence.entity.City;
import com.hexahome.persistence.entity.Locality;
import com.hexahome.persistence.repository.CityRepository;
import com.hexahome.persistence.repository.LocalityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final CityRepository cityRepository;
    private final LocalityRepository localityRepository;

    public LocationService(CityRepository cityRepository, LocalityRepository localityRepository) {
        this.cityRepository = cityRepository;
        this.localityRepository = localityRepository;
    }

    @Transactional(readOnly = true)
    public List<CityDto> getAllActiveCities() {
        return cityRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(city -> {
                    long count = cityRepository.countActivePropertiesByCityId(city.getId());
                    return CityDto.fromEntity(city, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CityDto getCityBySlug(String slug) {
        City city = cityRepository.findBySlug(slug.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("City", "slug", slug));
        long count = cityRepository.countActivePropertiesByCityId(city.getId());
        return CityDto.fromEntity(city, count);
    }

    @Transactional(readOnly = true)
    public List<LocalityDto> getLocalitiesByCitySlug(String citySlug) {
        City city = cityRepository.findBySlug(citySlug.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("City", "slug", citySlug));

        return localityRepository.findAllByCitySlugOrderByDisplayOrderAsc(city.getSlug())
                .stream()
                .map(locality -> {
                    long count = localityRepository.countActivePropertiesByLocalityId(locality.getId());
                    return LocalityDto.fromEntity(locality, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LocalityDto getLocalityByCitySlugAndLocalitySlug(String citySlug, String localitySlug) {
        City city = cityRepository.findBySlug(citySlug.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("City", "slug", citySlug));

        Locality locality = localityRepository.findByCityIdAndSlug(city.getId(), localitySlug.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Locality", "slug", localitySlug));

        long count = localityRepository.countActivePropertiesByLocalityId(locality.getId());
        return LocalityDto.fromEntity(locality, count);
    }
}
