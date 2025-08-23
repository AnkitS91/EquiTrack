package com.equitrack.controller;

import com.equitrack.model.Position;
import com.equitrack.service.PositionServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PositionController {

    private final PositionServiceJPA positionService;

    @Autowired
    public PositionController(PositionServiceJPA positionService) {
        this.positionService = positionService;
    }

    /**
     * Get all current positions
     */
    @GetMapping("/positions")
    public ResponseEntity<List<Position>> getPositions() {
        try {
            List<Position> positions = positionService.getPositions();
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all trades
     */
    @GetMapping("/trades")
    public ResponseEntity<List<com.equitrack.model.Trade>> getTrades() {
        try {
            List<com.equitrack.model.Trade> trades = positionService.getTrades();
            return ResponseEntity.ok(trades);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Add a new transaction
     */
    @PostMapping("/transactions")
    public ResponseEntity<TransactionResponse> addTransaction(@RequestBody com.equitrack.model.Transaction transaction) {
        try {
            // Auto-generate transaction ID if not provided
            if (transaction.getTransactionId() == null) {
                transaction.setTransactionId(System.currentTimeMillis());
            }

            positionService.processTransaction(transaction);
            
            TransactionResponse response = new TransactionResponse();
            response.setMessage("Transaction processed successfully");
            response.setTransaction(transaction);
            response.setPositions(positionService.getPositions());
            
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Add multiple transactions
     */
    @PostMapping("/transactions/bulk")
    public ResponseEntity<BulkTransactionResponse> addBulkTransactions(@RequestBody List<com.equitrack.model.Transaction> transactions) {
        try {
            positionService.processTransactions(transactions);
            
            BulkTransactionResponse response = new BulkTransactionResponse();
            response.setMessage("Transactions processed successfully");
            response.setPositions(positionService.getPositions());
            
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Reset all data
     */
    @PostMapping("/reset")
    public ResponseEntity<MessageResponse> resetData() {
        try {
            positionService.clear();
            MessageResponse response = new MessageResponse();
            response.setMessage("Data reset successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Load sample data
     */
    @PostMapping("/load-sample")
    public ResponseEntity<SampleDataResponse> loadSampleData() {
        try {
            positionService.clear();
            
            // Sample transactions from the problem statement
            List<com.equitrack.model.Transaction> sampleTransactions = List.of(
                new com.equitrack.model.Transaction(1L, 1L, 1, "REL", 50, com.equitrack.model.TransactionAction.INSERT, com.equitrack.model.TransactionSide.Buy),
                new com.equitrack.model.Transaction(2L, 2L, 1, "ITC", 40, com.equitrack.model.TransactionAction.INSERT, com.equitrack.model.TransactionSide.Sell),
                new com.equitrack.model.Transaction(3L, 3L, 1, "INF", 70, com.equitrack.model.TransactionAction.INSERT, com.equitrack.model.TransactionSide.Buy),
                new com.equitrack.model.Transaction(4L, 1L, 2, "REL", 60, com.equitrack.model.TransactionAction.UPDATE, com.equitrack.model.TransactionSide.Buy),
                new com.equitrack.model.Transaction(5L, 2L, 2, "ITC", 30, com.equitrack.model.TransactionAction.CANCEL, com.equitrack.model.TransactionSide.Buy),
                new com.equitrack.model.Transaction(6L, 4L, 1, "INF", 20, com.equitrack.model.TransactionAction.INSERT, com.equitrack.model.TransactionSide.Sell)
            );
            
            positionService.processTransactions(sampleTransactions);
            
            SampleDataResponse response = new SampleDataResponse();
            response.setMessage("Sample data loaded successfully");
            response.setPositions(positionService.getPositions());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get transaction by ID
     */
    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<com.equitrack.model.Transaction> getTransactionById(@PathVariable Long transactionId) {
        try {
            return positionService.getTransactionById(transactionId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get trade by ID
     */
    @GetMapping("/trades/{tradeId}")
    public ResponseEntity<com.equitrack.model.Trade> getTradeById(@PathVariable Long tradeId) {
        try {
            return positionService.getTradeById(tradeId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get position by security code
     */
    @GetMapping("/positions/{securityCode}")
    public ResponseEntity<Position> getPositionBySecurityCode(@PathVariable String securityCode) {
        try {
            return positionService.getPositionBySecurityCode(securityCode)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete transaction by ID
     */
    @DeleteMapping("/transactions/{transactionId}")
    public ResponseEntity<MessageResponse> deleteTransaction(@PathVariable Long transactionId) {
        try {
            positionService.deleteTransaction(transactionId);
            MessageResponse response = new MessageResponse();
            response.setMessage("Transaction deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete trade by ID
     */
    @DeleteMapping("/trades/{tradeId}")
    public ResponseEntity<MessageResponse> deleteTrade(@PathVariable Long tradeId) {
        try {
            positionService.deleteTrade(tradeId);
            MessageResponse response = new MessageResponse();
            response.setMessage("Trade deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete position by security code
     */
    @DeleteMapping("/positions/{securityCode}")
    public ResponseEntity<MessageResponse> deletePosition(@PathVariable String securityCode) {
        try {
            positionService.deletePosition(securityCode);
            MessageResponse response = new MessageResponse();
            response.setMessage("Position deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<com.equitrack.model.Transaction>> getAllTransactions() {
        try {
            List<com.equitrack.model.Transaction> transactions = positionService.getTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        HealthResponse response = new HealthResponse();
        response.setStatus("OK");
        response.setTimestamp(new java.util.Date().toString());
        return ResponseEntity.ok(response);
    }

    // Response classes
    public static class TransactionResponse {
        private String message;
        private com.equitrack.model.Transaction transaction;
        private List<Position> positions;

        // Getters and Setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public com.equitrack.model.Transaction getTransaction() { return transaction; }
        public void setTransaction(com.equitrack.model.Transaction transaction) { this.transaction = transaction; }
        public List<Position> getPositions() { return positions; }
        public void setPositions(List<Position> positions) { this.positions = positions; }
    }

    public static class BulkTransactionResponse {
        private String message;
        private List<Position> positions;

        // Getters and Setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<Position> getPositions() { return positions; }
        public void setPositions(List<Position> positions) { this.positions = positions; }
    }

    public static class MessageResponse {
        private String message;

        // Getters and Setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class SampleDataResponse {
        private String message;
        private List<Position> positions;

        // Getters and Setters
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<Position> getPositions() { return positions; }
        public void setPositions(List<Position> positions) { this.positions = positions; }
    }

    public static class HealthResponse {
        private String status;
        private String timestamp;

        // Getters and Setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    }
}
