package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "contact_views",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_property_view", columnNames = {"user_id", "property_id"})
)
public class ContactView {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "credit_deducted", nullable = false)
    private Integer creditDeducted = 1;

    @Column(name = "viewed_at", nullable = false, updatable = false)
    private Instant viewedAt;

    public ContactView() {
    }

    public ContactView(User user, Property property, Integer creditDeducted) {
        this.user = user;
        this.property = property;
        this.creditDeducted = creditDeducted;
    }

    @PrePersist
    protected void onCreate() {
        this.viewedAt = Instant.now();
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

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public Integer getCreditDeducted() {
        return creditDeducted;
    }

    public void setCreditDeducted(Integer creditDeducted) {
        this.creditDeducted = creditDeducted;
    }

    public Instant getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(Instant viewedAt) {
        this.viewedAt = viewedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContactView that = (ContactView) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
