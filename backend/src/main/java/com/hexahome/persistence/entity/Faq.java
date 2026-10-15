package com.hexahome.persistence.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "faqs")
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String question;

    @Column(nullable = false, columnDefinition = "text")
    private String answer;

    @Column(nullable = false, length = 50)
    private String category = "GENERAL"; // GENERAL, TENANT, OWNER, PAYMENT

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    public Faq() {
    }

    public Faq(String question, String answer, String category, Integer displayOrder) {
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Faq faq = (Faq) o;
        return Objects.equals(id, faq.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
