package com.hexahome.application.dto.engagement;

import com.hexahome.persistence.entity.SavedSearch;
import java.time.Instant;
import java.util.UUID;

public class SavedSearchDto {

    private UUID id;
    private String title;
    private String filterCriteria;
    private Boolean whatsappAlert;
    private Boolean emailAlert;
    private Instant createdAt;

    public SavedSearchDto() {
    }

    public SavedSearchDto(UUID id, String title, String filterCriteria, Boolean whatsappAlert, Boolean emailAlert, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.filterCriteria = filterCriteria;
        this.whatsappAlert = whatsappAlert;
        this.emailAlert = emailAlert;
        this.createdAt = createdAt;
    }

    public static SavedSearchDto fromEntity(SavedSearch entity) {
        if (entity == null) return null;
        return new SavedSearchDto(
                entity.getId(),
                entity.getTitle(),
                entity.getFilterCriteria(),
                entity.getWhatsappAlert(),
                entity.getEmailAlert(),
                entity.getCreatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFilterCriteria() {
        return filterCriteria;
    }

    public void setFilterCriteria(String filterCriteria) {
        this.filterCriteria = filterCriteria;
    }

    public Boolean getWhatsappAlert() {
        return whatsappAlert;
    }

    public void setWhatsappAlert(Boolean whatsappAlert) {
        this.whatsappAlert = whatsappAlert;
    }

    public Boolean getEmailAlert() {
        return emailAlert;
    }

    public void setEmailAlert(Boolean emailAlert) {
        this.emailAlert = emailAlert;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
