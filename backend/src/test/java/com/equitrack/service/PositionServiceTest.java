package com.equitrack.service;

import com.equitrack.model.Position;
import com.equitrack.model.Trade;
import com.equitrack.model.Transaction;
import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PositionServiceTest {

    private PositionService positionService;

    @BeforeEach
    void setUp() {
        positionService = new PositionService();
    }

    @Test
    void testSampleDataProcessing() {
        // Sample transactions from the problem statement
        List<Transaction> sampleTransactions = List.of(
            new Transaction(1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy),
            new Transaction(2L, 2L, 1, "ITC", 40, TransactionAction.INSERT, TransactionSide.Sell),
            new Transaction(3L, 3L, 1, "INF", 70, TransactionAction.INSERT, TransactionSide.Buy),
            new Transaction(4L, 1L, 2, "REL", 60, TransactionAction.UPDATE, TransactionSide.Buy),
            new Transaction(5L, 2L, 2, "ITC", 30, TransactionAction.CANCEL, TransactionSide.Buy),
            new Transaction(6L, 4L, 1, "INF", 20, TransactionAction.INSERT, TransactionSide.Sell)
        );

        // Process transactions
        positionService.processTransactions(sampleTransactions);

        // Get final positions
        List<Position> positions = positionService.getPositions();
        List<Trade> trades = positionService.getTrades();

        // Verify expected results
        assertEquals(3, positions.size());

        // Check REL position (should be +60 after UPDATE)
        Position relPosition = positions.stream()
                .filter(p -> "REL".equals(p.getSecurityCode()))
                .findFirst()
                .orElse(null);
        assertNotNull(relPosition);
        assertEquals(60, relPosition.getQuantity());

        // Check ITC position (should be 0 after CANCEL)
        Position itcPosition = positions.stream()
                .filter(p -> "ITC".equals(p.getSecurityCode()))
                .findFirst()
                .orElse(null);
        assertNotNull(itcPosition);
        assertEquals(0, itcPosition.getQuantity());

        // Check INF position (should be +50: 70 Buy - 20 Sell)
        Position infPosition = positions.stream()
                .filter(p -> "INF".equals(p.getSecurityCode()))
                .findFirst()
                .orElse(null);
        assertNotNull(infPosition);
        assertEquals(50, infPosition.getQuantity());

        // Verify trades
        assertEquals(4, trades.size());

        // Check that Trade 2 is cancelled
        Trade cancelledTrade = trades.stream()
                .filter(t -> t.getTradeId().equals(2L))
                .findFirst()
                .orElse(null);
        assertNotNull(cancelledTrade);
        assertTrue(cancelledTrade.getIsCancelled());

        // Check that Trade 1 is updated to version 2
        Trade updatedTrade = trades.stream()
                .filter(t -> t.getTradeId().equals(1L))
                .findFirst()
                .orElse(null);
        assertNotNull(updatedTrade);
        assertEquals(2, updatedTrade.getCurrentVersion());
        assertEquals(60, updatedTrade.getQuantity());
    }

    @Test
    void testInsertTransaction() {
        Transaction transaction = new Transaction(1L, 1L, 1, "AAPL", 100, TransactionAction.INSERT, TransactionSide.Buy);
        positionService.processTransaction(transaction);

        List<Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals(100, positions.get(0).getQuantity());
        assertEquals("AAPL", positions.get(0).getSecurityCode());
    }

    @Test
    void testUpdateTransaction() {
        // First insert
        Transaction insert = new Transaction(1L, 1L, 1, "AAPL", 100, TransactionAction.INSERT, TransactionSide.Buy);
        positionService.processTransaction(insert);

        // Then update
        Transaction update = new Transaction(2L, 1L, 2, "AAPL", 150, TransactionAction.UPDATE, TransactionSide.Buy);
        positionService.processTransaction(update);

        List<Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals(150, positions.get(0).getQuantity());
    }

    @Test
    void testCancelTransaction() {
        // First insert
        Transaction insert = new Transaction(1L, 1L, 1, "AAPL", 100, TransactionAction.INSERT, TransactionSide.Buy);
        positionService.processTransaction(insert);

        // Then cancel
        Transaction cancel = new Transaction(2L, 1L, 2, "AAPL", 100, TransactionAction.CANCEL, TransactionSide.Buy);
        positionService.processTransaction(cancel);

        List<Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals(0, positions.get(0).getQuantity());
    }

    @Test
    void testMixedBuySell() {
        Transaction buy = new Transaction(1L, 1L, 1, "AAPL", 100, TransactionAction.INSERT, TransactionSide.Buy);
        Transaction sell = new Transaction(2L, 2L, 1, "AAPL", 30, TransactionAction.INSERT, TransactionSide.Sell);

        positionService.processTransaction(buy);
        positionService.processTransaction(sell);

        List<Position> positions = positionService.getPositions();
        assertEquals(1, positions.size());
        assertEquals(70, positions.get(0).getQuantity()); // 100 - 30
    }

    @Test
    void testClearData() {
        Transaction transaction = new Transaction(1L, 1L, 1, "AAPL", 100, TransactionAction.INSERT, TransactionSide.Buy);
        positionService.processTransaction(transaction);

        assertEquals(1, positionService.getPositions().size());

        positionService.clear();

        assertEquals(0, positionService.getPositions().size());
        assertEquals(0, positionService.getTrades().size());
    }
}
