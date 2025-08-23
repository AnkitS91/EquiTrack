import { PositionService } from '../services/PositionService';
import { Transaction } from '../types';

// Test the business logic with the sample data
function testPositionService() {
  console.log('🧪 Testing Position Service...\n');

  const positionService = new PositionService();

  // Sample transactions from the problem statement
  const sampleTransactions: Transaction[] = [
    { transactionId: 1, tradeId: 1, version: 1, securityCode: 'REL', quantity: 50, action: 'INSERT', side: 'Buy' },
    { transactionId: 2, tradeId: 2, version: 1, securityCode: 'ITC', quantity: 40, action: 'INSERT', side: 'Sell' },
    { transactionId: 3, tradeId: 3, version: 1, securityCode: 'INF', quantity: 70, action: 'INSERT', side: 'Buy' },
    { transactionId: 4, tradeId: 1, version: 2, securityCode: 'REL', quantity: 60, action: 'UPDATE', side: 'Buy' },
    { transactionId: 5, tradeId: 2, version: 2, securityCode: 'ITC', quantity: 30, action: 'CANCEL', side: 'Buy' },
    { transactionId: 6, tradeId: 4, version: 1, securityCode: 'INF', quantity: 20, action: 'INSERT', side: 'Sell' }
  ];

  console.log('📊 Processing sample transactions...\n');

  // Process transactions one by one to show intermediate states
  sampleTransactions.forEach((transaction, index) => {
    console.log(`Transaction ${index + 1}:`, {
      tradeId: transaction.tradeId,
      version: transaction.version,
      security: transaction.securityCode,
      quantity: transaction.quantity,
      action: transaction.action,
      side: transaction.side
    });

    positionService.processTransaction(transaction);

    const positions = positionService.getPositions();
    console.log('Current positions:', positions);
    console.log('---');
  });

  // Final positions
  const finalPositions = positionService.getPositions();
  console.log('\n🎯 Final Positions:');
  finalPositions.forEach(position => {
    const sign = position.quantity > 0 ? '+' : '';
    console.log(`${position.securityCode}: ${sign}${position.quantity}`);
  });

  // Verify expected results
  console.log('\n✅ Expected Results:');
  console.log('REL: +60 (Updated from 50 to 60)');
  console.log('ITC: 0 (Cancelled trade)');
  console.log('INF: +50 (70 Buy - 20 Sell)');

  // Get all trades
  const trades = positionService.getTrades();
  console.log('\n📋 All Trades:');
  trades.forEach(trade => {
    console.log(`Trade ${trade.tradeId}: ${trade.securityCode} ${trade.quantity} ${trade.side} - ${trade.isCancelled ? 'CANCELLED' : 'ACTIVE'} (v${trade.currentVersion})`);
  });

  return finalPositions;
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPositionService();
}

export { testPositionService };
