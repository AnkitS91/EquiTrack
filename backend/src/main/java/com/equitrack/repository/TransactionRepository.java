package com.equitrack.repository;

import com.equitrack.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Find transaction by transaction ID
     */
    Optional<Transaction> findByTransactionId(Long transactionId);
    
    /**
     * Find all transactions by trade ID
     */
    List<Transaction> findByTradeIdOrderByVersionAsc(Long tradeId);
    
    /**
     * Find transaction by trade ID and version
     */
    Optional<Transaction> findByTradeIdAndVersion(Long tradeId, Integer version);
    
    /**
     * Find the latest version of a trade
     */
    @Query("SELECT t FROM Transaction t WHERE t.tradeId = :tradeId AND t.version = " +
           "(SELECT MAX(t2.version) FROM Transaction t2 WHERE t2.tradeId = :tradeId)")
    Optional<Transaction> findLatestVersionByTradeId(@Param("tradeId") Long tradeId);
    
    /**
     * Check if transaction exists by transaction ID
     */
    boolean existsByTransactionId(Long transactionId);
    
    /**
     * Check if transaction exists by trade ID and version
     */
    boolean existsByTradeIdAndVersion(Long tradeId, Integer version);
    
    /**
     * Find all transactions ordered by transaction ID
     */
    List<Transaction> findAllByOrderByTransactionIdAsc();
    
    /**
     * Find transactions by security code
     */
    List<Transaction> findBySecurityCodeOrderByTransactionIdAsc(String securityCode);
    
    /**
     * Find transactions by action type
     */
    List<Transaction> findByActionOrderByTransactionIdAsc(String action);
    
    /**
     * Count transactions by trade ID
     */
    long countByTradeId(Long tradeId);
    
    /**
     * Delete all transactions by trade ID
     */
    void deleteByTradeId(Long tradeId);
}
