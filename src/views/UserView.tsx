import React from 'react';
import { useStore } from '../store/useStore';

function UserView() {
  const { auth, users, stocks, transactions } = useStore();
  
  // Get the authenticated user
  const user = users.find(u => u.id === auth.userId);
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
      </div>
    );
  }

  const portfolioValue = Object.entries(user.portfolio).reduce((total, [stockId, holding]) => {
    const stock = stocks.find(s => s.id === stockId);
    return total + (stock ? stock.price * holding.quantity : 0);
  }, 0);

  const userTransactions = transactions
    .filter(t => t.userId === user.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{user.name}'s Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Cash Balance</p>
            <p className="text-2xl font-semibold">₹{user.balance.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="text-2xl font-semibold">₹{portfolioValue.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Worth</p>
            <p className="text-2xl font-semibold">₹{(user.balance + portfolioValue).toFixed(2)}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Current Stock Prices</h3>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{stock.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.availableQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mb-4">Your Holdings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(user.portfolio).map(([stockId, holding]) => {
                const stock = stocks.find(s => s.id === stockId);
                if (!stock || holding.quantity === 0) return null;
                
                const currentValue = stock.price * holding.quantity;
                const investedValue = holding.averagePrice * holding.quantity;
                const profitLoss = currentValue - investedValue;
                
                return (
                  <tr key={stockId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{holding.averagePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{stock.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{currentValue.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{profitLoss.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {userTransactions.map(transaction => {
            const stock = stocks.find(s => s.id === transaction.stockId);
            return (
              <div key={transaction.id} className="border-b pb-4">
                <p className="text-sm">
                  {transaction.type === 'BUY' ? 'Bought' : 'Sold'}{' '}
                  {transaction.quantity} shares of {stock?.name}{' '}
                  at ₹{transaction.price}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserView;