package com.equitrack.service;

import com.equitrack.model.Position;
import com.equitrack.model.Trade;
import com.equitrack.model.Transaction;
import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PositionService {
    
    private final Map<Long, Trade> trades = new ConcurrentHashMap<>();
    private final Map<String, Integer> positions = new ConcurrentHashMap<>();

    /**
     * Process a transaction and update positions accordingly
     */
    public void processTransaction(Transaction transaction) {
        Trade existingTrade = trades.get(transaction.getTradeId());
        
        if (transaction.getAction() == TransactionAction.INSERT) {
            handleInsert(transaction);
        } else if (transaction.getAction() == TransactionAction.UPDATE) {
            handleUpdate(transaction, existingTrade);
        } else if (transaction.getAction() == TransactionAction.CANCEL) {
            handleCancel(transaction, existingTrade);
        }
    }

    /**
     * Handle INSERT transaction
     */
    private void handleInsert(Transaction transaction) {
        // Remove any existing position impact from this trade
        Trade existingTrade = trades.get(transaction.getTradeId());
        if (existingTrade != null) {
            removeTradeImpact(existingTrade);
        }

        // Create new trade
        Trade trade = new Trade(
            transaction.getTradeId(),
            transaction.getVersion(),
            transaction.getSecurityCode(),
            transaction.getQuantity(),
            transaction.getSide(),
            false
        );

        trades.put(transaction.getTradeId(), trade);
        addTradeImpact(trade);
    }

    /**
     * Handle UPDATE transaction
     */
    private void handleUpdate(Transaction transaction, Trade existingTrade) {
        if (existingTrade == null) {
            // If we don't have the original trade yet, store this update for later processing
            // In a real system, you might want to queue this transaction
            return;
        }

        // Remove impact of existing trade
        removeTradeImpact(existingTrade);

        // Update trade with new values
        existingTrade.setCurrentVersion(transaction.getVersion());
        existingTrade.setSecurityCode(transaction.getSecurityCode());
        existingTrade.setQuantity(transaction.getQuantity());
        existingTrade.setSide(transaction.getSide());

        // Add impact of updated trade
        addTradeImpact(existingTrade);
    }

    /**
     * Handle CANCEL transaction
     */
    private void handleCancel(Transaction transaction, Trade existingTrade) {
        if (existingTrade == null) {
            // If we don't have the original trade yet, store this cancel for later processing
            return;
        }

        // Remove impact of existing trade
        removeTradeImpact(existingTrade);

        // Mark trade as cancelled
        existingTrade.setIsCancelled(true);
        existingTrade.setCurrentVersion(transaction.getVersion());
    }

    /**
     * Add the impact of a trade to positions
     */
    private void addTradeImpact(Trade trade) {
        if (trade.getIsCancelled()) return;

        String securityCode = trade.getSecurityCode();
        int currentPosition = positions.getOrDefault(securityCode, 0);
        int impact = trade.getSide() == TransactionSide.Buy ? trade.getQuantity() : -trade.getQuantity();
        positions.put(securityCode, currentPosition + impact);
    }

    /**
     * Remove the impact of a trade from positions
     */
    private void removeTradeImpact(Trade trade) {
        if (trade.getIsCancelled()) return;

        String securityCode = trade.getSecurityCode();
        int currentPosition = positions.getOrDefault(securityCode, 0);
        int impact = trade.getSide() == TransactionSide.Buy ? trade.getQuantity() : -trade.getQuantity();
        positions.put(securityCode, currentPosition - impact);
    }

    /**
     * Get current positions
     */
    public List<Position> getPositions() {
        return positions.entrySet().stream()
                .map(entry -> new Position(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    /**
     * Get all trades
     */
    public List<Trade> getTrades() {
        return new ArrayList<>(trades.values());
    }

    /**
     * Clear all data (for testing/reset)
     */
    public void clear() {
        trades.clear();
        positions.clear();
    }

    /**
     * Process multiple transactions in sequence
     */
    public void processTransactions(List<Transaction> transactions) {
        // Sort transactions by version to ensure proper order
        List<Transaction> sortedTransactions = transactions.stream()
                .sorted(Comparator
                        .comparing(Transaction::getTradeId)
                        .thenComparing(Transaction::getVersion))
                .collect(Collectors.toList());

        for (Transaction transaction : sortedTransactions) {
            processTransaction(transaction);
        }
    }
}
