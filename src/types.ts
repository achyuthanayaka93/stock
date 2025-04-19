export interface User {
  id: string;
  name: string;
  password: string;
  balance: number;
  portfolio: Portfolio;
}

export interface Stock {
  id: string;
  name: string;
  price: number;
  availableQuantity: number;
}

export interface Portfolio {
  [stockId: string]: {
    quantity: number;
    averagePrice: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  stockId: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: number;
}

export type TransactionType = 'BUY' | 'SELL';

export interface AuthState {
  isAuthenticated: boolean;
  userType: 'admin' | 'user' | null;
  userId: string | null;
}
