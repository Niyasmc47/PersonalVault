package com.personalvault.dto.transaction;

import com.personalvault.entity.transaction.TransactionCategory;

import java.math.BigDecimal;

public class CategorySummaryDTO {

    private TransactionCategory category;
    private BigDecimal total;

    public CategorySummaryDTO() {
    }

    public CategorySummaryDTO(TransactionCategory category, BigDecimal total) {
        this.category = category;
        this.total = total;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public void setCategory(TransactionCategory category) {
        this.category = category;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
