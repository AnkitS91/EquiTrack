export interface Transaction {
  transactionId: number;
  tradeId: number;
  version: number;
  securityCode: string;
  quantity: number;
  action: 'INSERT' | 'UPDATE' | 'CANCEL';
  side: 'Buy' | 'Sell';
}

export interface Position {
  securityCode: string;
  quantity: number;
}

export interface Trade {
  tradeId: number;
  currentVersion: number;
  securityCode: string;
  quantity: number;
  side: 'Buy' | 'Sell';
  isCancelled: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
