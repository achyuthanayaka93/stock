import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Stock, Transaction, AuthState } from '../types';
import bcrypt from 'bcryptjs';

interface StoreState {
  users: User[];
  stocks: Stock[];
  transactions: Transaction[];
  auth: AuthState;
  addUser: (name: string, password: string) => Promise<string>;
  addStock: (name: string, price: number, quantity: number) => void;
  updateStockPrice: (stockId: string, newPrice: number) => void;
  executeTransaction: (userId: string, userPassword: string, stockId: string, type: 'BUY' | 'SELL', quantity: number) => Promise<boolean>;
  login: (username: string, password: string, type: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
}

const ADMIN_USERNAME = 'iedc';
const ADMIN_PASSWORD = 'iedcbit@2025';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      users: [],
      stocks: [],
      transactions: [],
      auth: {
        isAuthenticated: false,
        userType: null,
        userId: null,
      },

      addUser: async (name: string, password: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          password: hashedPassword,
          balance: 10000,
          portfolio: {}
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser.id;
      },

      addStock: (name: string, price: number, quantity: number) => set((state) => {
        const newStock: Stock = {
          id: crypto.randomUUID(),
          name,
          price,
          availableQuantity: quantity
        };
        return { stocks: [...state.stocks, newStock] };
      }),

      updateStockPrice: (stockId: string, newPrice: number) => set((state) => ({
        stocks: state.stocks.map(stock =>
          stock.id === stockId ? { ...stock, price: newPrice } : stock
        )
      })),

      executeTransaction: async (userId: string, userPassword: string, stockId: string, type: 'BUY' | 'SELL', quantity: number) => {
        const state = get();
        const user = state.users.find(u => u.id === userId);
        
        if (!user || !(await bcrypt.compare(userPassword, user.password))) {
          return false;
        }

        const stock = state.stocks.find(s => s.id === stockId);
        if (!stock) return false;

        const totalPrice = stock.price * quantity;
        
        if (type === 'BUY') {
          if (user.balance < totalPrice || stock.availableQuantity < quantity) {
            return false;
          }

          set((state) => {
            const updatedUsers = state.users.map(u => {
              if (u.id === userId) {
                const currentHolding = u.portfolio[stockId] || { quantity: 0, averagePrice: 0 };
                const newQuantity = currentHolding.quantity + quantity;
                const newAveragePrice = (
                  (currentHolding.quantity * currentHolding.averagePrice) + 
                  (quantity * stock.price)
                ) / newQuantity;

                return {
                  ...u,
                  balance: u.balance - totalPrice,
                  portfolio: {
                    ...u.portfolio,
                    [stockId]: {
                      quantity: newQuantity,
                      averagePrice: newAveragePrice
                    }
                  }
                };
              }
              return u;
            });

            const updatedStocks = state.stocks.map(s =>
              s.id === stockId ? { ...s, availableQuantity: s.availableQuantity - quantity } : s
            );

            const newTransaction: Transaction = {
              id: crypto.randomUUID(),
              userId,
              stockId,
              type,
              quantity,
              price: stock.price,
              timestamp: Date.now()
            };

            return {
              users: updatedUsers,
              stocks: updatedStocks,
              transactions: [...state.transactions, newTransaction]
            };
          });

          return true;
        }

        if (type === 'SELL') {
          const userStock = user.portfolio[stockId];
          if (!userStock || userStock.quantity < quantity) {
            return false;
          }

          set((state) => {
            const updatedUsers = state.users.map(u => {
              if (u.id === userId) {
                const newQuantity = userStock.quantity - quantity;
                return {
                  ...u,
                  balance: u.balance + totalPrice,
                  portfolio: {
                    ...u.portfolio,
                    [stockId]: {
                      quantity: newQuantity,
                      averagePrice: newQuantity === 0 ? 0 : userStock.averagePrice
                    }
                  }
                };
              }
              return u;
            });

            const updatedStocks = state.stocks.map(s =>
              s.id === stockId ? { ...s, availableQuantity: s.availableQuantity + quantity } : s
            );

            const newTransaction: Transaction = {
              id: crypto.randomUUID(),
              userId,
              stockId,
              type,
              quantity,
              price: stock.price,
              timestamp: Date.now()
            };

            return {
              users: updatedUsers,
              stocks: updatedStocks,
              transactions: [...state.transactions, newTransaction]
            };
          });

          return true;
        }

        return false;
      },

      login: async (username: string, password: string, type: 'admin' | 'user') => {
        if (type === 'admin') {
          if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            set((state) => ({
              auth: {
                isAuthenticated: true,
                userType: 'admin',
                userId: null
              }
            }));
            return true;
          }
          return false;
        }

        const user = get().users.find(u => u.name === username);
        if (user && await bcrypt.compare(password, user.password)) {
          set((state) => ({
            auth: {
              isAuthenticated: true,
              userType: 'user',
              userId: user.id
            }
          }));
          return true;
        }
        return false;
      },

      logout: () => set((state) => ({
        auth: {
          isAuthenticated: false,
          userType: null,
          userId: null
        }
      }))
    }),
    {
      name: 'stock-market-storage',
      partialize: (state) => ({
        users: state.users,
        stocks: state.stocks,
        transactions: state.transactions,
        auth: state.auth
      })
    }
  )
);