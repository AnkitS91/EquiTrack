package com.equitrack.repository;

import com.equitrack.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    
    /**
     * Find position by security code
     */
    Optional<Position> findBySecurityCode(String securityCode);
    
    /**
     * Find all positions ordered by security code
     */
    List<Position> findAllByOrderBySecurityCodeAsc();
    
    /**
     * Find positions with positive quantity (long positions)
     */
    List<Position> findByQuantityGreaterThanOrderBySecurityCodeAsc(Integer quantity);
    
    /**
     * Find positions with negative quantity (short positions)
     */
    List<Position> findByQuantityLessThanOrderBySecurityCodeAsc(Integer quantity);
    
    /**
     * Find positions with zero quantity (flat positions)
     */
    List<Position> findByQuantityOrderBySecurityCodeAsc(Integer quantity);
    
    /**
     * Check if position exists by security code
     */
    boolean existsBySecurityCode(String securityCode);
    
    /**
     * Count total number of positions
     */
    long count();
    
    /**
     * Count positions with positive quantity
     */
    long countByQuantityGreaterThan(Integer quantity);
    
    /**
     * Count positions with negative quantity
     */
    long countByQuantityLessThan(Integer quantity);
    
    /**
     * Count positions with zero quantity
     */
    long countByQuantity(Integer quantity);
    
    /**
     * Find positions by security code pattern (LIKE query)
     */
    @Query("SELECT p FROM Position p WHERE p.securityCode LIKE %:pattern% ORDER BY p.securityCode ASC")
    List<Position> findBySecurityCodeContainingOrderBySecurityCodeAsc(@Param("pattern") String pattern);
    
    /**
     * Find positions with quantity in specified range
     */
    @Query("SELECT p FROM Position p WHERE p.quantity BETWEEN :minQuantity AND :maxQuantity ORDER BY p.securityCode ASC")
    List<Position> findByQuantityBetweenOrderBySecurityCodeAsc(@Param("minQuantity") Integer minQuantity, 
                                                              @Param("maxQuantity") Integer maxQuantity);
    
    /**
     * Find positions updated after specified date
     */
    @Query("SELECT p FROM Position p WHERE p.updatedAt >= :date ORDER BY p.securityCode ASC")
    List<Position> findByUpdatedAtAfterOrderBySecurityCodeAsc(@Param("date") java.time.LocalDateTime date);
    
    /**
     * Find positions created after specified date
     */
    @Query("SELECT p FROM Position p WHERE p.createdAt >= :date ORDER BY p.securityCode ASC")
    List<Position> findByCreatedAtAfterOrderBySecurityCodeAsc(@Param("date") java.time.LocalDateTime date);
    
    /**
     * Delete position by security code
     */
    void deleteBySecurityCode(String securityCode);
    
    /**
     * Find top positions by absolute quantity value
     */
    @Query("SELECT p FROM Position p ORDER BY ABS(p.quantity) DESC")
    List<Position> findTopByOrderByAbsoluteQuantityDesc();
}
