package com.personalvault.service;

import com.personalvault.dto.*;
import com.personalvault.entity.User;
import com.personalvault.entity.Transaction;
import com.personalvault.entity.TransactionCategory;
import com.personalvault.entity.TransactionType;
import com.personalvault.exception.InvalidRequestException;
import com.personalvault.exception.ResourceNotFoundException;
import com.personalvault.mapper.TransactionMapper;
import com.personalvault.repository.UserRepository;
import com.personalvault.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public TransactionResponse createTransaction(String email, CreateTransactionRequest request) {
        User user = resolveUser(email);
        validateCategoryForType(request.getCategory(), request.getType());

        Transaction transaction = TransactionMapper.toEntity(request, user);
        transaction = transactionRepository.save(transaction);
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(String email, Long id) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(String email, Long id, UpdateTransactionRequest request) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        validateCategoryForType(request.getCategory(), request.getType());

        TransactionMapper.updateEntity(transaction, request);
        transaction = transactionRepository.save(transaction);
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional
    public void deleteTransaction(String email, Long id) {
        User user = resolveUser(email);
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public TransactionSummaryDTO getSummary(String email) {
        User user = resolveUser(email);

        BigDecimal totalIncome = transactionRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpenses = transactionRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);

        // Guard against null when user has no income or expense transactions
        BigDecimal income = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        BigDecimal expenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
        BigDecimal balance = income.subtract(expenses);
        long count = transactionRepository.countByUser(user);

        return new TransactionSummaryDTO(income, expenses, balance, count);
    }

    @Transactional(readOnly = true)
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
