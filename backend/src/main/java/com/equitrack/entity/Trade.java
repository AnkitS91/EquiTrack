package com.equitrack.entity;

import com.equitrack.model.TransactionSide;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
public class Trade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Trade ID is required")
    @Column(name = "trade_id", unique = true, nullable = false)
    private Long tradeId;
    
    @NotNull(message = "Current version is required")
    @Column(name = "current_version", nullable = false)
    private Integer currentVersion;
    
    @NotBlank(message = "Security code is required")
    @Column(name = "security_code", nullable = false)
    private String securityCode;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "side", nullable = false)
    private TransactionSide side;
    
    @Column(name = "is_cancelled", nullable = false)
    private Boolean isCancelled = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public Trade() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with all fields
    public Trade(Long tradeId, Integer currentVersion, String securityCode, 
                Integer quantity, TransactionSide side) {
        this();
        this.tradeId = tradeId;
        this.currentVersion = currentVersion;
        this.securityCode = securityCode;
        this.quantity = quantity;
        this.side = side;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTradeId() {
        return tradeId;
    }
    
    public void setTradeId(Long tradeId) {
        this.tradeId = tradeId;
    }
    
    public Integer getCurrentVersion() {
        return currentVersion;
    }
    
    public void setCurrentVersion(Integer currentVersion) {
        this.currentVersion = currentVersion;
    }
    
    public String getSecurityCode() {
        return securityCode;
    }
    
    public void setSecurityCode(String securityCode) {
        this.securityCode = securityCode;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public TransactionSide getSide() {
        return side;
    }
    
    public void setSide(TransactionSide side) {
        this.side = side;
    }
    
    public Boolean getIsCancelled() {
        return isCancelled;
    }
    
    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "Trade{" +
                "id=" + id +
                ", tradeId=" + tradeId +
                ", currentVersion=" + currentVersion +
                ", securityCode='" + securityCode + '\'' +
                ", quantity=" + quantity +
                ", side=" + side +
                ", isCancelled=" + isCancelled +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
