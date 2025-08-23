package com.equitrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

public class Position {
    
    @JsonProperty("securityCode")
    private String securityCode;
    
    @JsonProperty("quantity")
    private Integer quantity;

    // Default constructor
    public Position() {}

    // Constructor with all fields
    public Position(String securityCode, Integer quantity) {
        this.securityCode = securityCode;
        this.quantity = quantity;
    }

    // Getters and Setters
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Position position = (Position) o;
        return Objects.equals(securityCode, position.securityCode) &&
               Objects.equals(quantity, position.quantity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(securityCode, quantity);
    }

    @Override
    public String toString() {
        return "Position{" +
                "securityCode='" + securityCode + '\'' +
                ", quantity=" + quantity +
                '}';
    }
}
