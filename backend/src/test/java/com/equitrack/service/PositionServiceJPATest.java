package com.equitrack.service;

import com.equitrack.entity.Position;
import com.equitrack.entity.Trade;
import com.equitrack.entity.Transaction;
import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import com.equitrack.repository.PositionRepository;
import com.equitrack.repository.TradeRepository;
import com.equitrack.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PositionServiceJPATest {

    @Autowired
    private PositionServiceJPA positionService;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private PositionRepository positionRepository;

    @BeforeEach
    void setUp() {
        // Clear all data before each test
        positionService.clear();
    }

    @Test
    void testProcessInsertTransaction() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );

        // When
        positionService.processTransaction(transaction);

        // Then
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals("REL", positions.get(0).getSecurityCode());
        assertEquals(50, positions.get(0).getQuantity());

        List<com.equitrack.model.Trade> trades = positionService.getTrades();
        assertEquals(1, trades.size());
        assertEquals(1L, trades.get(0).getTradeId());
        assertEquals("REL", trades.get(0).getSecurityCode());
        assertEquals(50, trades.get(0).getQuantity());
        assertEquals(TransactionSide.Buy, trades.get(0).getSide());
        assertFalse(trades.get(0).getIsCancelled());
    }

    @Test
    void testProcessUpdateTransaction() {
        // Given - Insert initial transaction
        com.equitrack.model.Transaction insertTransaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(insertTransaction);

        // Update transaction
        com.equitrack.model.Transaction updateTransaction = new com.equitrack.model.Transaction(
            2L, 1L, 2, "REL", 60, TransactionAction.UPDATE, TransactionSide.Buy
        );

        // When
        positionService.processTransaction(updateTransaction);

        // Then
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals("REL", positions.get(0).getSecurityCode());
        assertEquals(60, positions.get(0).getQuantity());

        List<com.equitrack.model.Trade> trades = positionService.getTrades();
        assertEquals(1, trades.size());
        assertEquals(2, trades.get(0).getCurrentVersion());
        assertEquals(60, trades.get(0).getQuantity());
    }

    @Test
    void testProcessCancelTransaction() {
        // Given - Insert initial transaction
        com.equitrack.model.Transaction insertTransaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(insertTransaction);

        // Cancel transaction
        com.equitrack.model.Transaction cancelTransaction = new com.equitrack.model.Transaction(
            2L, 1L, 2, "REL", 50, TransactionAction.CANCEL, TransactionSide.Buy
        );

        // When
        positionService.processTransaction(cancelTransaction);

        // Then
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        assertEquals(0, positions.size()); // Position should be removed

        List<com.equitrack.model.Trade> trades = positionService.getTrades();
        assertEquals(1, trades.size());
        assertTrue(trades.get(0).getIsCancelled());
    }

    @Test
    void testProcessSampleData() {
        // Given - Sample transactions from problem statement
        List<com.equitrack.model.Transaction> sampleTransactions = List.of(
            new com.equitrack.model.Transaction(1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy),
            new com.equitrack.model.Transaction(2L, 2L, 1, "ITC", 40, TransactionAction.INSERT, TransactionSide.Sell),
            new com.equitrack.model.Transaction(3L, 3L, 1, "INF", 70, TransactionAction.INSERT, TransactionSide.Buy),
            new com.equitrack.model.Transaction(4L, 1L, 2, "REL", 60, TransactionAction.UPDATE, TransactionSide.Buy),
            new com.equitrack.model.Transaction(5L, 2L, 2, "ITC", 30, TransactionAction.CANCEL, TransactionSide.Buy),
            new com.equitrack.model.Transaction(6L, 4L, 1, "INF", 20, TransactionAction.INSERT, TransactionSide.Sell)
        );

        // When
        positionService.processTransactions(sampleTransactions);

        // Then
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        assertEquals(2, positions.size()); // ITC position with 0 quantity is deleted

        // Expected final positions:
        // REL: +60 (Updated from 50 to 60)
        // INF: +50 (70 Buy - 20 Sell)
        // ITC: 0 (Cancelled trade - not stored in database)

        Optional<com.equitrack.model.Position> relPosition = positions.stream()
            .filter(p -> "REL".equals(p.getSecurityCode()))
            .findFirst();
        assertTrue(relPosition.isPresent());
        assertEquals(60, relPosition.get().getQuantity());

        Optional<com.equitrack.model.Position> infPosition = positions.stream()
            .filter(p -> "INF".equals(p.getSecurityCode()))
            .findFirst();
        assertTrue(infPosition.isPresent());
        assertEquals(50, infPosition.get().getQuantity());

        // Verify ITC position is not present (deleted when quantity became 0)
        Optional<com.equitrack.model.Position> itcPosition = positions.stream()
            .filter(p -> "ITC".equals(p.getSecurityCode()))
            .findFirst();
        assertFalse(itcPosition.isPresent());
    }

    @Test
    void testGetTransactionById() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        Optional<com.equitrack.model.Transaction> found = positionService.getTransactionById(1L);

        // Then
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getTransactionId());
        assertEquals("REL", found.get().getSecurityCode());
    }

    @Test
    void testGetTradeById() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        Optional<com.equitrack.model.Trade> found = positionService.getTradeById(1L);

        // Then
        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getTradeId());
        assertEquals("REL", found.get().getSecurityCode());
    }

    @Test
    void testGetPositionBySecurityCode() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        Optional<com.equitrack.model.Position> found = positionService.getPositionBySecurityCode("REL");

        // Then
        assertTrue(found.isPresent());
        assertEquals("REL", found.get().getSecurityCode());
        assertEquals(50, found.get().getQuantity());
    }

    @Test
    void testDeleteTransaction() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        positionService.deleteTransaction(1L);

        // Then
        Optional<com.equitrack.model.Transaction> found = positionService.getTransactionById(1L);
        assertFalse(found.isPresent());
    }

    @Test
    void testDeleteTrade() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        positionService.deleteTrade(1L);

        // Then
        Optional<com.equitrack.model.Trade> found = positionService.getTradeById(1L);
        assertFalse(found.isPresent());

        // Position should also be removed
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        assertEquals(0, positions.size());
    }

    @Test
    void testDeletePosition() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        positionService.deletePosition("REL");

        // Then
        Optional<com.equitrack.model.Position> found = positionService.getPositionBySecurityCode("REL");
        assertFalse(found.isPresent());
    }

    @Test
    void testClearAllData() {
        // Given
        com.equitrack.model.Transaction transaction = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction);

        // When
        positionService.clear();

        // Then
        List<com.equitrack.model.Position> positions = positionService.getPositions();
        List<com.equitrack.model.Trade> trades = positionService.getTrades();
        List<com.equitrack.model.Transaction> transactions = positionService.getTransactions();

        assertEquals(0, positions.size());
        assertEquals(0, trades.size());
        assertEquals(0, transactions.size());
    }

    @Test
    void testDuplicateTransactionId() {
        // Given
        com.equitrack.model.Transaction transaction1 = new com.equitrack.model.Transaction(
            1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy
        );
        positionService.processTransaction(transaction1);

        com.equitrack.model.Transaction transaction2 = new com.equitrack.model.Transaction(
            1L, 2L, 1, "ITC", 40, TransactionAction.INSERT, TransactionSide.Sell
        );

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            positionService.processTransaction(transaction2);
        });
    }
}
