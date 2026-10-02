package com.personalvault.mapper;

import com.personalvault.dto.CreateTransactionRequest;
import com.personalvault.dto.TransactionResponse;
import com.personalvault.dto.UpdateTransactionRequest;
import com.personalvault.entity.User;
import com.personalvault.entity.Transaction;

public class TransactionMapper {

    public static TransactionResponse toResponse(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getCategory(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getPaymentMethod(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }

    public static Transaction toEntity(CreateTransactionRequest request, User user) {
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setPaymentMethod(request.getPaymentMethod());
        return transaction;
    }

    public static void updateEntity(Transaction transaction, UpdateTransactionRequest request) {
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setPaymentMethod(request.getPaymentMethod());
    }
}
