package com.equitrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public class Trade {
    
    @JsonProperty("tradeId")
    private Long tradeId;
    
    @JsonProperty("currentVersion")
    private Integer currentVersion;
    
    @JsonProperty("securityCode")
    private String securityCode;
    
    @JsonProperty("quantity")
    private Integer quantity;
    
    @JsonProperty("side")
    private TransactionSide side;
    
    @JsonProperty("isCancelled")
    private Boolean isCancelled;

    // Default constructor
    public Trade() {}

    // Constructor with all fields
    public Trade(Long tradeId, Integer currentVersion, String securityCode, 
                Integer quantity, TransactionSide side, Boolean isCancelled) {
        this.tradeId = tradeId;
        this.currentVersion = currentVersion;
        this.securityCode = securityCode;
        this.quantity = quantity;
        this.side = side;
        this.isCancelled = isCancelled;
    }

    // Getters and Setters
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Trade trade = (Trade) o;
        return Objects.equals(tradeId, trade.tradeId) &&
               Objects.equals(currentVersion, trade.currentVersion) &&
               Objects.equals(securityCode, trade.securityCode) &&
               Objects.equals(quantity, trade.quantity) &&
               side == trade.side &&
               Objects.equals(isCancelled, trade.isCancelled);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tradeId, currentVersion, securityCode, quantity, side, isCancelled);
    }

    @Override
    public String toString() {
        return "Trade{" +
                "tradeId=" + tradeId +
                ", currentVersion=" + currentVersion +
                ", securityCode='" + securityCode + '\'' +
                ", quantity=" + quantity +
                ", side=" + side +
                ", isCancelled=" + isCancelled +
                '}';
    }
}
