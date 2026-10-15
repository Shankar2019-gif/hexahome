package com.hexahome.application.service.impl;

import com.hexahome.domain.exception.ResourceNotFoundException;
import com.hexahome.application.dto.engagement.SavedSearchDto;
import com.hexahome.application.dto.engagement.SavedSearchRequest;
import com.hexahome.persistence.entity.SavedSearch;
import com.hexahome.persistence.entity.User;
import com.hexahome.persistence.repository.SavedSearchRepository;
import com.hexahome.persistence.repository.UserRepository;
import com.hexahome.application.service.SavedSearchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SavedSearchServiceImpl implements SavedSearchService {

    private final SavedSearchRepository savedSearchRepository;
    private final UserRepository userRepository;

    public SavedSearchServiceImpl(SavedSearchRepository savedSearchRepository, UserRepository userRepository) {
        this.savedSearchRepository = savedSearchRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public SavedSearchDto saveSearch(UUID userId, SavedSearchRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        SavedSearch entity = new SavedSearch(
                user,
                request.getTitle(),
                request.getFilterCriteria(),
                request.getWhatsappAlert(),
                request.getEmailAlert()
        );

        SavedSearch saved = savedSearchRepository.save(entity);
        return SavedSearchDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedSearchDto> getUserSavedSearches(UUID userId) {
        return savedSearchRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(SavedSearchDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void deleteSavedSearch(UUID userId, UUID id) {
        SavedSearch entity = savedSearchRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("SavedSearch", "id", id));
        savedSearchRepository.delete(entity);
    }
}
