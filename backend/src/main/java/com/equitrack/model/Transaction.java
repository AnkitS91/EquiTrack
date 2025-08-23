package com.equitrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.Objects;

public class Transaction {
    
    @JsonProperty("transactionId")
    private Long transactionId;
    
    @NotNull(message = "Trade ID is required")
    @Positive(message = "Trade ID must be positive")
    @JsonProperty("tradeId")
    private Long tradeId;
    
    @NotNull(message = "Version is required")
    @Positive(message = "Version must be positive")
    @JsonProperty("version")
    private Integer version;
    
    @NotBlank(message = "Security code is required")
    @JsonProperty("securityCode")
    private String securityCode;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    @JsonProperty("quantity")
    private Integer quantity;
    
    @NotNull(message = "Action is required")
    @JsonProperty("action")
    private TransactionAction action;
    
    @NotNull(message = "Side is required")
    @JsonProperty("side")
    private TransactionSide side;

    // Default constructor
    public Transaction() {}

    // Constructor with all fields
    public Transaction(Long transactionId, Long tradeId, Integer version, String securityCode, 
                      Integer quantity, TransactionAction action, TransactionSide side) {
        this.transactionId = transactionId;
        this.tradeId = tradeId;
        this.version = version;
        this.securityCode = securityCode;
        this.quantity = quantity;
        this.action = action;
        this.side = side;
    }

    // Getters and Setters
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(transactionId, that.transactionId) &&
               Objects.equals(tradeId, that.tradeId) &&
               Objects.equals(version, that.version) &&
               Objects.equals(securityCode, that.securityCode) &&
               Objects.equals(quantity, that.quantity) &&
               action == that.action &&
               side == that.side;
    }

    @Override
    public int hashCode() {
        return Objects.hash(transactionId, tradeId, version, securityCode, quantity, action, side);
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "transactionId=" + transactionId +
                ", tradeId=" + tradeId +
                ", version=" + version +
                ", securityCode='" + securityCode + '\'' +
                ", quantity=" + quantity +
                ", action=" + action +
                ", side=" + side +
                '}';
    }
}
