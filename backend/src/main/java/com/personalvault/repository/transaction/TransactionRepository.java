package com.personalvault.repository.transaction;

import com.personalvault.entity.auth.User;
import com.personalvault.entity.transaction.Transaction;
import com.personalvault.entity.transaction.TransactionCategory;
import com.personalvault.entity.transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(User user, TransactionType type);

    List<Transaction> findByUserAndCategoryOrderByTransactionDateDesc(User user, TransactionCategory category);

    @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
           "AND (CAST(:type AS string) IS NULL OR t.type = :type) " +
           "AND (CAST(:category AS string) IS NULL OR t.category = :category) " +
           "AND (CAST(:startDate AS date) IS NULL OR t.transactionDate >= :startDate) " +
           "AND (CAST(:endDate AS date) IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserWithFilters(
            @Param("user") User user,
            @Param("type") TransactionType type,
            @Param("category") TransactionCategory category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user")
    long countByUser(@Param("user") User user);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user = :user AND (:type IS NULL OR t.type = :type) " +
           "GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> getCategorySummary(@Param("user") User user, @Param("type") TransactionType type);
}
