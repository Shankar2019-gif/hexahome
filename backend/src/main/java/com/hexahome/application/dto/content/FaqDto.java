package com.hexahome.application.dto.content;

import com.hexahome.persistence.entity.Faq;

public class FaqDto {

    private Integer id;
    private String question;
    private String answer;
    private String category;
    private Integer displayOrder;

    public FaqDto() {
    }

    public FaqDto(Integer id, String question, String answer, String category, Integer displayOrder) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.displayOrder = displayOrder;
    }

    public static FaqDto fromEntity(Faq faq) {
        if (faq == null) return null;
        return new FaqDto(
                faq.getId(),
                faq.getQuestion(),
                faq.getAnswer(),
                faq.getCategory(),
                faq.getDisplayOrder()
        );
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
}
