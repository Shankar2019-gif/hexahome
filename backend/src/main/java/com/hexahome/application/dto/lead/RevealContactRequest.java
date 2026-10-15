package com.hexahome.application.dto.lead;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class RevealContactRequest {

    @NotNull(message = "Property ID is required")
    private UUID propertyId;

    public RevealContactRequest() {
    }

    public RevealContactRequest(UUID propertyId) {
        this.propertyId = propertyId;
    }

    public UUID getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(UUID propertyId) {
        this.propertyId = propertyId;
    }
}
