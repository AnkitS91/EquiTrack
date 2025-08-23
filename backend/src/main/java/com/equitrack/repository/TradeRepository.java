package com.equitrack.repository;

import com.equitrack.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    /**
     * Find trade by trade ID
     */
    Optional<Trade> findByTradeId(Long tradeId);
    
    /**
     * Find all trades ordered by trade ID
     */
    List<Trade> findAllByOrderByTradeIdAsc();
    
    /**
     * Find trades by security code
     */
    List<Trade> findBySecurityCodeOrderByTradeIdAsc(String securityCode);
    
    /**
     * Find active (non-cancelled) trades
     */
    List<Trade> findByIsCancelledFalseOrderByTradeIdAsc();
    
    /**
     * Find cancelled trades
     */
    List<Trade> findByIsCancelledTrueOrderByTradeIdAsc();
    
    /**
     * Find trades by side (Buy/Sell)
     */
    List<Trade> findBySideOrderByTradeIdAsc(String side);
    
    /**
     * Check if trade exists by trade ID
     */
    boolean existsByTradeId(Long tradeId);
    
    /**
     * Count trades by security code
     */
    long countBySecurityCode(String securityCode);
    
    /**
     * Count active trades by security code
     */
    long countBySecurityCodeAndIsCancelledFalse(String securityCode);
    
    /**
     * Find trades with quantity greater than specified value
     */
    List<Trade> findByQuantityGreaterThanOrderByTradeIdAsc(Integer quantity);
    
    /**
     * Find trades with quantity less than specified value
     */
    List<Trade> findByQuantityLessThanOrderByTradeIdAsc(Integer quantity);
    
    /**
     * Find trades by security code and side
     */
    List<Trade> findBySecurityCodeAndSideOrderByTradeIdAsc(String securityCode, String side);
    
    /**
     * Find active trades by security code and side
     */
    List<Trade> findBySecurityCodeAndSideAndIsCancelledFalseOrderByTradeIdAsc(String securityCode, String side);
    
    /**
     * Delete trade by trade ID
     */
    void deleteByTradeId(Long tradeId);
    
    /**
     * Find trades created after specified date
     */
    @Query("SELECT t FROM Trade t WHERE t.createdAt >= :date ORDER BY t.tradeId ASC")
    List<Trade> findByCreatedAtAfterOrderByTradeIdAsc(@Param("date") java.time.LocalDateTime date);
    
    /**
     * Find trades updated after specified date
     */
    @Query("SELECT t FROM Trade t WHERE t.updatedAt >= :date ORDER BY t.tradeId ASC")
    List<Trade> findByUpdatedAtAfterOrderByTradeIdAsc(@Param("date") java.time.LocalDateTime date);
}
