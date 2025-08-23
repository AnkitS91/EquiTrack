package com.equitrack;

import com.equitrack.model.Transaction;
import com.equitrack.model.TransactionAction;
import com.equitrack.model.TransactionSide;
import com.equitrack.service.PositionServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class EquiTrackApplication {

    @Autowired
    private PositionServiceJPA positionService;

    public static void main(String[] args) {
        SpringApplication.run(EquiTrackApplication.class, args);
        System.out.println("🚀 EquiTrack Backend server running on port 3001");
    }

    @Bean
    public CommandLineRunner loadSampleData() {
        return args -> {
            // Load sample data on startup
            List<Transaction> sampleTransactions = List.of(
                new Transaction(1L, 1L, 1, "REL", 50, TransactionAction.INSERT, TransactionSide.Buy),
                new Transaction(2L, 2L, 1, "ITC", 40, TransactionAction.INSERT, TransactionSide.Sell),
                new Transaction(3L, 3L, 1, "INF", 70, TransactionAction.INSERT, TransactionSide.Buy),
                new Transaction(4L, 1L, 2, "REL", 60, TransactionAction.UPDATE, TransactionSide.Buy),
                new Transaction(5L, 2L, 2, "ITC", 30, TransactionAction.CANCEL, TransactionSide.Buy),
                new Transaction(6L, 4L, 1, "INF", 20, TransactionAction.INSERT, TransactionSide.Sell)
            );
            
            positionService.processTransactions(sampleTransactions);
            System.out.println("📊 Sample data loaded with " + sampleTransactions.size() + " transactions");
        };
    }
}
