package com.hexahome.application.service;

import com.hexahome.application.dto.engagement.SavedSearchDto;
import com.hexahome.application.dto.engagement.SavedSearchRequest;

import java.util.List;
import java.util.UUID;

public interface SavedSearchService {

    SavedSearchDto saveSearch(UUID userId, SavedSearchRequest request);

    List<SavedSearchDto> getUserSavedSearches(UUID userId);

    void deleteSavedSearch(UUID userId, UUID id);
}
