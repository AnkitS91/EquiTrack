package com.equitrack.entity;

import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Transaction ID is required")
    @Column(name = "transaction_id", unique = true, nullable = false)
    private Long transactionId;
    
    @NotNull(message = "Trade ID is required")
    @Column(name = "trade_id", nullable = false)
    private Long tradeId;
    
    @NotNull(message = "Version is required")
    @Column(name = "version", nullable = false)
    private Integer version;
    
    @NotBlank(message = "Security code is required")
    @Column(name = "security_code", nullable = false)
    private String securityCode;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private TransactionAction action;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "side", nullable = false)
    private TransactionSide side;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public Transaction() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor with all fields
    public Transaction(Long transactionId, Long tradeId, Integer version, 
                      String securityCode, Integer quantity, TransactionAction action, TransactionSide side) {
        this();
        this.transactionId = transactionId;
        this.tradeId = tradeId;
        this.version = version;
        this.securityCode = securityCode;
        this.quantity = quantity;
        this.action = action;
        this.side = side;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
    
    public Long getTradeId() {
        return tradeId;
    }
    
    public void setTradeId(Long tradeId) {
        this.tradeId = tradeId;
    }
    
    public Integer getVersion() {
        return version;
    }
    
    public void setVersion(Integer version) {
        this.version = version;
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
    
    public TransactionAction getAction() {
        return action;
    }
    
    public void setAction(TransactionAction action) {
        this.action = action;
    }
    
    public TransactionSide getSide() {
        return side;
    }
    
    public void setSide(TransactionSide side) {
        this.side = side;
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
        return "Transaction{" +
                "id=" + id +
                ", transactionId=" + transactionId +
                ", tradeId=" + tradeId +
                ", version=" + version +
                ", securityCode='" + securityCode + '\'' +
                ", quantity=" + quantity +
                ", action=" + action +
                ", side=" + side +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
