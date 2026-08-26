package com.personalvault.service.transaction;

import com.personalvault.dto.transaction.*;
import com.personalvault.entity.auth.User;
import com.personalvault.entity.transaction.Transaction;
import com.personalvault.entity.transaction.TransactionCategory;
import com.personalvault.entity.transaction.TransactionType;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.exception.UnauthorizedAccessException;
import com.personalvault.mapper.transaction.TransactionMapper;
import com.personalvault.repository.auth.UserRepository;
import com.personalvault.repository.transaction.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public TransactionResponse createTransaction(String email, CreateTransactionRequest request) {
        User user = resolveUser(email);
        validateCategoryForType(request.getCategory(), request.getType());

        Transaction transaction = TransactionMapper.toEntity(request, user);
        transaction = transactionRepository.save(transaction);
        return TransactionMapper.toResponse(transaction);
    }

    public List<TransactionResponse> getTransactions(String email, TransactionType type,
                                                      TransactionCategory category,
                                                      LocalDate startDate, LocalDate endDate) {
        User user = resolveUser(email);

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new InvalidRequestException("Start date must not be after end date");
        }

        List<Transaction> transactions = transactionRepository.findByUserWithFilters(
                user, type, category, startDate, endDate);

        return transactions.stream()
                .map(TransactionMapper::toResponse)
                .toList();
    }

    public TransactionResponse getTransactionById(String email, Long id) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return TransactionMapper.toResponse(transaction);
    }

    public TransactionResponse updateTransaction(String email, Long id, UpdateTransactionRequest request) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        validateCategoryForType(request.getCategory(), request.getType());

        TransactionMapper.updateEntity(transaction, request);
        transaction = transactionRepository.save(transaction);
        return TransactionMapper.toResponse(transaction);
    }

    public void deleteTransaction(String email, Long id) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    public TransactionSummaryDTO getSummary(String email) {
        User user = resolveUser(email);

        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpenses);
        long count = transactionRepository.countByUser(user);

        return new TransactionSummaryDTO(totalIncome, totalExpenses, balance, count);
    }

    public List<CategorySummaryDTO> getCategorySummary(String email, TransactionType type) {
        User user = resolveUser(email);

        List<Object[]> results = transactionRepository.getCategorySummary(user, type);

        return results.stream()
                .map(row -> new CategorySummaryDTO(
                        (TransactionCategory) row[0],
                        (BigDecimal) row[1]
                ))
                .toList();
    }

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateCategoryForType(TransactionCategory category, TransactionType type) {
        if (!TransactionCategory.isValidForType(category, type)) {
            throw new InvalidRequestException(
                    "Category " + category + " is not valid for transaction type " + type);
        }
    }
}
