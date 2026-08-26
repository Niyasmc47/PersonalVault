package com.personalvault.entity.transaction;

import java.util.Set;

public enum TransactionCategory {

    // Expense categories
    FOOD,
    TRANSPORT,
    EDUCATION,
    SHOPPING,
    BILLS,
    ENTERTAINMENT,
    HEALTHCARE,
    TRAVEL,
    OTHER,

    // Income categories
    SALARY,
    FREELANCE,
    BUSINESS,
    SCHOLARSHIP,
    GIFT,
    INCOME_OTHER;

    private static final Set<TransactionCategory> EXPENSE_CATEGORIES = Set.of(
            FOOD, TRANSPORT, EDUCATION, SHOPPING, BILLS,
            ENTERTAINMENT, HEALTHCARE, TRAVEL, OTHER
    );

    private static final Set<TransactionCategory> INCOME_CATEGORIES = Set.of(
            SALARY, FREELANCE, BUSINESS, SCHOLARSHIP, GIFT, INCOME_OTHER
    );

    public static boolean isValidForType(TransactionCategory category, TransactionType type) {
        if (category == null || type == null) {
            return false;
        }
        return switch (type) {
            case EXPENSE -> EXPENSE_CATEGORIES.contains(category);
            case INCOME -> INCOME_CATEGORIES.contains(category);
        };
    }

    public static Set<TransactionCategory> getCategoriesForType(TransactionType type) {
        return switch (type) {
            case EXPENSE -> EXPENSE_CATEGORIES;
            case INCOME -> INCOME_CATEGORIES;
        };
    }
}
