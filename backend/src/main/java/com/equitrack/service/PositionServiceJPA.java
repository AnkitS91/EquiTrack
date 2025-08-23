package com.equitrack.service;

import com.equitrack.entity.Position;
import com.equitrack.entity.Trade;
import com.equitrack.entity.Transaction;
import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import com.equitrack.repository.PositionRepository;
import com.equitrack.repository.TradeRepository;
import com.equitrack.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PositionServiceJPA {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private TradeRepository tradeRepository;
    
    @Autowired
    private PositionRepository positionRepository;

    /**
     * Process a transaction and update positions accordingly
     */
    public void processTransaction(com.equitrack.model.Transaction transactionModel) {
        // Convert model to entity
        Transaction transaction = convertToEntity(transactionModel);
        
        // Check if transaction already exists
        if (transactionRepository.existsByTransactionId(transaction.getTransactionId())) {
            throw new IllegalArgumentException("Transaction with ID " + transaction.getTransactionId() + " already exists");
        }
        
        // Save transaction
        transactionRepository.save(transaction);
        
        // Process based on action
        Trade existingTrade = tradeRepository.findByTradeId(transaction.getTradeId()).orElse(null);
        
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
        Trade existingTrade = tradeRepository.findByTradeId(transaction.getTradeId()).orElse(null);
        if (existingTrade != null) {
            removeTradeImpact(existingTrade);
        }

        // Create new trade
        Trade trade = new Trade(
            transaction.getTradeId(),
            transaction.getVersion(),
            transaction.getSecurityCode(),
            transaction.getQuantity(),
            transaction.getSide()
        );

        tradeRepository.save(trade);
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

        tradeRepository.save(existingTrade);
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
        
        tradeRepository.save(existingTrade);
    }

    /**
     * Add the impact of a trade to positions
     */
    private void addTradeImpact(Trade trade) {
        if (trade.getIsCancelled()) return;

        String securityCode = trade.getSecurityCode();
        Position position = positionRepository.findBySecurityCode(securityCode).orElse(
            new Position(securityCode, 0)
        );
        
        int impact = trade.getSide() == TransactionSide.Buy ? trade.getQuantity() : -trade.getQuantity();
        position.setQuantity(position.getQuantity() + impact);
        
        positionRepository.save(position);
    }

    /**
     * Remove the impact of a trade from positions
     */
    private void removeTradeImpact(Trade trade) {
        if (trade.getIsCancelled()) return;

        String securityCode = trade.getSecurityCode();
        Position position = positionRepository.findBySecurityCode(securityCode).orElse(null);
        if (position != null) {
            int impact = trade.getSide() == TransactionSide.Buy ? trade.getQuantity() : -trade.getQuantity();
            position.setQuantity(position.getQuantity() - impact);
            
            if (position.getQuantity() == 0) {
                positionRepository.delete(position);
            } else {
                positionRepository.save(position);
            }
        }
    }

    /**
     * Get current positions
     */
    @Transactional(readOnly = true)
    public List<com.equitrack.model.Position> getPositions() {
        return positionRepository.findAllByOrderBySecurityCodeAsc().stream()
                .map(this::convertToModel)
                .collect(Collectors.toList());
    }

    /**
     * Get all trades
     */
    @Transactional(readOnly = true)
    public List<com.equitrack.model.Trade> getTrades() {
        return tradeRepository.findAllByOrderByTradeIdAsc().stream()
                .map(this::convertToModel)
                .collect(Collectors.toList());
    }

    /**
     * Get all transactions
     */
    @Transactional(readOnly = true)
    public List<com.equitrack.model.Transaction> getTransactions() {
        return transactionRepository.findAllByOrderByTransactionIdAsc().stream()
                .map(this::convertToModel)
                .collect(Collectors.toList());
    }

    /**
     * Clear all data (for testing/reset)
     */
    public void clear() {
        positionRepository.deleteAll();
        tradeRepository.deleteAll();
        transactionRepository.deleteAll();
    }

    /**
     * Process multiple transactions in sequence
     */
    public void processTransactions(List<com.equitrack.model.Transaction> transactions) {
        // Sort transactions by version to ensure proper order
        List<com.equitrack.model.Transaction> sortedTransactions = transactions.stream()
                .sorted(Comparator
                        .comparing(com.equitrack.model.Transaction::getTradeId)
                        .thenComparing(com.equitrack.model.Transaction::getVersion))
                .collect(Collectors.toList());

        for (com.equitrack.model.Transaction transaction : sortedTransactions) {
            processTransaction(transaction);
        }
    }

    /**
     * Convert model to entity
     */
    private Transaction convertToEntity(com.equitrack.model.Transaction model) {
        return new Transaction(
            model.getTransactionId(),
            model.getTradeId(),
            model.getVersion(),
            model.getSecurityCode(),
            model.getQuantity(),
            model.getAction(),
            model.getSide()
        );
    }

    /**
     * Convert entity to model
     */
    private com.equitrack.model.Position convertToModel(Position entity) {
        return new com.equitrack.model.Position(entity.getSecurityCode(), entity.getQuantity());
    }

    /**
     * Convert entity to model
     */
    private com.equitrack.model.Trade convertToModel(Trade entity) {
        return new com.equitrack.model.Trade(
            entity.getTradeId(),
            entity.getCurrentVersion(),
            entity.getSecurityCode(),
            entity.getQuantity(),
            entity.getSide(),
            entity.getIsCancelled()
        );
    }

    /**
     * Convert entity to model
     */
    private com.equitrack.model.Transaction convertToModel(Transaction entity) {
        return new com.equitrack.model.Transaction(
            entity.getTransactionId(),
            entity.getTradeId(),
            entity.getVersion(),
            entity.getSecurityCode(),
            entity.getQuantity(),
            entity.getAction(),
            entity.getSide()
        );
    }

    /**
     * Get transaction by ID
     */
    @Transactional(readOnly = true)
    public Optional<com.equitrack.model.Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findByTransactionId(transactionId)
                .map(this::convertToModel);
    }

    /**
     * Get trade by ID
     */
    @Transactional(readOnly = true)
    public Optional<com.equitrack.model.Trade> getTradeById(Long tradeId) {
        return tradeRepository.findByTradeId(tradeId)
                .map(this::convertToModel);
    }

    /**
     * Get position by security code
     */
    @Transactional(readOnly = true)
    public Optional<com.equitrack.model.Position> getPositionBySecurityCode(String securityCode) {
        return positionRepository.findBySecurityCode(securityCode)
                .map(this::convertToModel);
    }

    /**
     * Delete transaction by ID
     */
    public void deleteTransaction(Long transactionId) {
        transactionRepository.findByTransactionId(transactionId).ifPresent(transactionRepository::delete);
    }

    /**
     * Delete trade by ID
     */
    public void deleteTrade(Long tradeId) {
        tradeRepository.findByTradeId(tradeId).ifPresent(trade -> {
            removeTradeImpact(trade);
            tradeRepository.delete(trade);
        });
    }

    /**
     * Delete position by security code
     */
    public void deletePosition(String securityCode) {
        positionRepository.findBySecurityCode(securityCode).ifPresent(positionRepository::delete);
    }
}
