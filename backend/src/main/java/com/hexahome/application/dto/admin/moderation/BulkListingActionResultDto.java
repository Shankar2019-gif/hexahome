package com.hexahome.application.dto.admin.moderation;

import java.util.List;

public class BulkListingActionResultDto {

    private int totalRequested;
    private int succeeded;
    private int failed;
    private List<String> errors;

    public BulkListingActionResultDto() {
    }

    public BulkListingActionResultDto(int totalRequested, int succeeded, int failed, List<String> errors) {
        this.totalRequested = totalRequested;
        this.succeeded = succeeded;
        this.failed = failed;
        this.errors = errors;
    }

    public int getTotalRequested() {
        return totalRequested;
    }

    public void setTotalRequested(int totalRequested) {
        this.totalRequested = totalRequested;
    }

    public int getSucceeded() {
        return succeeded;
    }

    public void setSucceeded(int succeeded) {
        this.succeeded = succeeded;
    }

    public int getFailed() {
        return failed;
    }

    public void setFailed(int failed) {
        this.failed = failed;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
