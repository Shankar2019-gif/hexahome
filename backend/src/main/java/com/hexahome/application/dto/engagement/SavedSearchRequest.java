package com.hexahome.application.dto.engagement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SavedSearchRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Filter criteria is required")
    private String filterCriteria;

    private Boolean whatsappAlert = true;

    private Boolean emailAlert = true;

    public SavedSearchRequest() {
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
}
