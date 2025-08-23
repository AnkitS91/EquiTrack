import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PositionService } from './services/PositionService';
import { Transaction } from './types';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize position service
const positionService = new PositionService();

// Sample data for testing
const sampleTransactions: Transaction[] = [
  { transactionId: 1, tradeId: 1, version: 1, securityCode: 'REL', quantity: 50, action: 'INSERT', side: 'Buy' },
  { transactionId: 2, tradeId: 2, version: 1, securityCode: 'ITC', quantity: 40, action: 'INSERT', side: 'Sell' },
  { transactionId: 3, tradeId: 3, version: 1, securityCode: 'INF', quantity: 70, action: 'INSERT', side: 'Buy' },
  { transactionId: 4, tradeId: 1, version: 2, securityCode: 'REL', quantity: 60, action: 'UPDATE', side: 'Buy' },
  { transactionId: 5, tradeId: 2, version: 2, securityCode: 'ITC', quantity: 30, action: 'CANCEL', side: 'Buy' },
  { transactionId: 6, tradeId: 4, version: 1, securityCode: 'INF', quantity: 20, action: 'INSERT', side: 'Sell' }
];

// Initialize with sample data
positionService.processTransactions(sampleTransactions);

// API Routes

// Get all positions
app.get('/api/positions', (req, res) => {
  try {
    const positions = positionService.getPositions();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Get all trades
app.get('/api/trades', (req, res) => {
  try {
    const trades = positionService.getTrades();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Add a new transaction
app.post('/api/transactions', (req, res) => {
  try {
    const transaction: Transaction = req.body;
    
    // Validate required fields
    if (!transaction.tradeId || !transaction.version || !transaction.securityCode || 
        !transaction.quantity || !transaction.action || !transaction.side) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Auto-generate transaction ID if not provided
    if (!transaction.transactionId) {
      transaction.transactionId = Date.now();
    }

    positionService.processTransaction(transaction);
    
    res.status(201).json({ 
      message: 'Transaction processed successfully',
      transaction,
      positions: positionService.getPositions()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

// Add multiple transactions
app.post('/api/transactions/bulk', (req, res) => {
  try {
    const transactions: Transaction[] = req.body;
    
    if (!Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Request body must be an array of transactions' });
    }

    // Validate each transaction
    for (const transaction of transactions) {
      if (!transaction.tradeId || !transaction.version || !transaction.securityCode || 
          !transaction.quantity || !transaction.action || !transaction.side) {
        return res.status(400).json({ error: 'Missing required fields in one or more transactions' });
      }
    }

    positionService.processTransactions(transactions);
    
    res.status(201).json({ 
      message: 'Transactions processed successfully',
      positions: positionService.getPositions()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process transactions' });
  }
});

// Reset data
app.post('/api/reset', (req, res) => {
  try {
    positionService.clear();
    res.json({ message: 'Data reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

// Load sample data
app.post('/api/load-sample', (req, res) => {
  try {
    positionService.clear();
    positionService.processTransactions(sampleTransactions);
    res.json({ 
      message: 'Sample data loaded successfully',
      positions: positionService.getPositions()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load sample data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 EquiTrack Backend server running on port ${port}`);
  console.log(`📊 Sample data loaded with ${sampleTransactions.length} transactions`);
});
