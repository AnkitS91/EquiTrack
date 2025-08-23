import { Transaction, Position, Trade } from '../types';

export class PositionService {
  private trades: Map<number, Trade> = new Map();
  private positions: Map<string, number> = new Map();

  /**
   * Process a transaction and update positions accordingly
   */
  processTransaction(transaction: Transaction): void {
    const existingTrade = this.trades.get(transaction.tradeId);
    
    if (transaction.action === 'INSERT') {
      this.handleInsert(transaction);
    } else if (transaction.action === 'UPDATE') {
      this.handleUpdate(transaction, existingTrade);
    } else if (transaction.action === 'CANCEL') {
      this.handleCancel(transaction, existingTrade);
    }
  }

  /**
   * Handle INSERT transaction
   */
  private handleInsert(transaction: Transaction): void {
    // Remove any existing position impact from this trade
    const existingTrade = this.trades.get(transaction.tradeId);
    if (existingTrade) {
      this.removeTradeImpact(existingTrade);
    }

    // Create new trade
    const trade: Trade = {
      tradeId: transaction.tradeId,
      currentVersion: transaction.version,
      securityCode: transaction.securityCode,
      quantity: transaction.quantity,
      side: transaction.side,
      isCancelled: false
    };

    this.trades.set(transaction.tradeId, trade);
    this.addTradeImpact(trade);
  }

  /**
   * Handle UPDATE transaction
   */
  private handleUpdate(transaction: Transaction, existingTrade: Trade | undefined): void {
    if (!existingTrade) {
      // If we don't have the original trade yet, store this update for later processing
      // In a real system, you might want to queue this transaction
      return;
    }

    // Remove impact of existing trade
    this.removeTradeImpact(existingTrade);

    // Update trade with new values
    existingTrade.currentVersion = transaction.version;
    existingTrade.securityCode = transaction.securityCode;
    existingTrade.quantity = transaction.quantity;
    existingTrade.side = transaction.side;

    // Add impact of updated trade
    this.addTradeImpact(existingTrade);
  }

  /**
   * Handle CANCEL transaction
   */
  private handleCancel(transaction: Transaction, existingTrade: Trade | undefined): void {
    if (!existingTrade) {
      // If we don't have the original trade yet, store this cancel for later processing
      return;
    }

    // Remove impact of existing trade
    this.removeTradeImpact(existingTrade);

    // Mark trade as cancelled
    existingTrade.isCancelled = true;
    existingTrade.currentVersion = transaction.version;
  }

  /**
   * Add the impact of a trade to positions
   */
  private addTradeImpact(trade: Trade): void {
    if (trade.isCancelled) return;

    const currentPosition = this.positions.get(trade.securityCode) || 0;
    const impact = trade.side === 'Buy' ? trade.quantity : -trade.quantity;
    this.positions.set(trade.securityCode, currentPosition + impact);
  }

  /**
   * Remove the impact of a trade from positions
   */
  private removeTradeImpact(trade: Trade): void {
    if (trade.isCancelled) return;

    const currentPosition = this.positions.get(trade.securityCode) || 0;
    const impact = trade.side === 'Buy' ? trade.quantity : -trade.quantity;
    this.positions.set(trade.securityCode, currentPosition - impact);
  }

  /**
   * Get current positions
   */
  getPositions(): Position[] {
    return Array.from(this.positions.entries()).map(([securityCode, quantity]) => ({
      securityCode,
      quantity
    }));
  }

  /**
   * Get all trades
   */
  getTrades(): Trade[] {
    return Array.from(this.trades.values());
  }

  /**
   * Clear all data (for testing/reset)
   */
  clear(): void {
    this.trades.clear();
    this.positions.clear();
  }

  /**
   * Process multiple transactions in sequence
   */
  processTransactions(transactions: Transaction[]): void {
    // Sort transactions by version to ensure proper order
    const sortedTransactions = transactions.sort((a, b) => {
      if (a.tradeId !== b.tradeId) {
        return a.tradeId - b.tradeId;
      }
      return a.version - b.version;
    });

    for (const transaction of sortedTransactions) {
      this.processTransaction(transaction);
    }
  }
}
