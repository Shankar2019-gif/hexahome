package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "saved_searches")
public class SavedSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "filter_criteria", nullable = false, columnDefinition = "jsonb")
    private String filterCriteria;


    @Column(name = "whatsapp_alert", nullable = false)
    private Boolean whatsappAlert = true;

    @Column(name = "email_alert", nullable = false)
    private Boolean emailAlert = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public SavedSearch() {
    }

    public SavedSearch(User user, String title, String filterCriteria, Boolean whatsappAlert, Boolean emailAlert) {
        this.user = user;
        this.title = title;
        this.filterCriteria = filterCriteria;
        this.whatsappAlert = whatsappAlert != null ? whatsappAlert : true;
        this.emailAlert = emailAlert != null ? emailAlert : true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SavedSearch that = (SavedSearch) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
