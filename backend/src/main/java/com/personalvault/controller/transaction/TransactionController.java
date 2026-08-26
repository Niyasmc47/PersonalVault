package com.personalvault.controller.transaction;

import com.personalvault.dto.transaction.*;
import com.personalvault.entity.transaction.TransactionCategory;
import com.personalvault.entity.transaction.TransactionType;
import com.personalvault.service.transaction.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(
                userDetails.getUsername(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionCategory category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        List<TransactionResponse> transactions = transactionService.getTransactions(
                userDetails.getUsername(), type, category, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        TransactionResponse response = transactionService.getTransactionById(
                userDetails.getUsername(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateTransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(
                userDetails.getUsername(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        transactionService.deleteTransaction(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryDTO> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionSummaryDTO summary = transactionService.getSummary(userDetails.getUsername());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryDTO>> getCategorySummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) TransactionType type) {
        List<CategorySummaryDTO> summary = transactionService.getCategorySummary(
                userDetails.getUsername(), type);
        return ResponseEntity.ok(summary);
    }
}
