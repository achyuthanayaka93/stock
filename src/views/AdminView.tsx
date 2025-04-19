import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PlusCircle, RefreshCw, ArrowUpDown } from 'lucide-react';

function AdminView() {
  const {
    users,
    stocks,
    transactions,
    addUser,
    addStock,
    updateStockPrice,
    executeTransaction,
  } = useStore();
  const [newUser, setNewUser] = useState({ name: '', password: '' });
  const [newStock, setNewStock] = useState({
    name: '',
    price: '',
    quantity: '',
  });
  const [updateStock, setUpdateStock] = useState({ stockId: '', newPrice: '' });
  const [transaction, setTransaction] = useState({
    userId: '',
    userPassword: '',
    stockId: '',
    type: 'BUY' as 'BUY' | 'SELL',
    quantity: '',
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name.trim() && newUser.password.trim()) {
      await addUser(newUser.name, newUser.password);
      setNewUser({ name: '', password: '' });
    }
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStock.name && newStock.price && newStock.quantity) {
      addStock(
        newStock.name,
        Number(newStock.price),
        Number(newStock.quantity)
      );
      setNewStock({ name: '', price: '', quantity: '' });
    }
  };

  const handleUpdateStockPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateStock.stockId && updateStock.newPrice) {
      updateStockPrice(updateStock.stockId, Number(updateStock.newPrice));
      setUpdateStock({ stockId: '', newPrice: '' });
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      transaction.userId &&
      transaction.userPassword &&
      transaction.stockId &&
      transaction.quantity
    ) {
      await executeTransaction(
        transaction.userId,
        transaction.userPassword,
        transaction.stockId,
        transaction.type,
        Number(transaction.quantity)
      );
      setTransaction({
        userId: '',
        userPassword: '',
        stockId: '',
        type: 'BUY',
        quantity: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add User Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter user name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add User
            </button>
          </form>
        </div>

        {/* Add Stock Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Stock</h2>
          <form onSubmit={handleAddStock} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Name
              </label>
              <input
                type="text"
                value={newStock.name}
                onChange={(e) =>
                  setNewStock({ ...newStock, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter stock name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={newStock.price}
                onChange={(e) =>
                  setNewStock({ ...newStock, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={newStock.quantity}
                onChange={(e) =>
                  setNewStock({ ...newStock, quantity: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter quantity"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Stock
            </button>
          </form>
        </div>

        {/* Update Stock Price Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Update Stock Price</h2>
          <form onSubmit={handleUpdateStockPrice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <label
                htmlFor="stock-select"
                className="block text-sm font-medium text-gray-700"
              >
                Select Stock
              </label>
              <label htmlFor="transaction-stock-select" className="sr-only">
                Select Stock
              </label>
              <select
                id="stock-select"
                aria-label="Select Stock"
                value={updateStock.stockId}
                onChange={(e) =>
                  setUpdateStock({ ...updateStock, stockId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Stock</option>
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name} (Current: ₹{stock.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Price
              </label>
              <input
                type="number"
                value={updateStock.newPrice}
                onChange={(e) =>
                  setUpdateStock({ ...updateStock, newPrice: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter new price"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Update Price
            </button>
          </form>
        </div>

        {/* Execute Transaction Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Execute Transaction</h2>
          <form onSubmit={handleTransaction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label htmlFor="user-select" className="sr-only">
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select User
                </label>
                <select
                  id="user-select"
                  aria-label="Select User"
                  value={transaction.userId}
                  onChange={(e) =>
                    setTransaction({ ...transaction, userId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Password
                </label>
                <input
                  type="password"
                  value={transaction.userPassword}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      userPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter user's password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <select
                  title="Select Stock"
                  aria-label="Select Stock"
                  value={transaction.stockId}
                  onChange={(e) =>
                    setTransaction({ ...transaction, stockId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Stock</option>
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name} (₹{stock.price})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  title="Transaction Type"
                  value={transaction.type}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      type: e.target.value as 'BUY' | 'SELL',
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={transaction.quantity}
                  onChange={(e) =>
                    setTransaction({ ...transaction, quantity: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Execute Transaction
            </button>
          </form>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Users Summary</h2>
          <div className="space-y-4">
            {users.map((user) => {
              const portfolioValue = Object.entries(user.portfolio).reduce(
                (total, [stockId, holding]) => {
                  const stock = stocks.find((s) => s.id === stockId);
                  return total + (stock ? stock.price * holding.quantity : 0);
                },
                0
              );

              return (
                <div key={user.id} className="border-b pb-4">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    Balance: ₹{user.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Portfolio Value: ₹{portfolioValue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Worth: ₹{(user.balance + portfolioValue).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions
              .slice(-5)
              .reverse()
              .map((transaction) => {
                const user = users.find((u) => u.id === transaction.userId);
                const stock = stocks.find((s) => s.id === transaction.stockId);

                return (
                  <div key={transaction.id} className="border-b pb-4">
                    <p className="text-sm">
                      <span className="font-medium">{user?.name}</span>{' '}
                      {transaction.type === 'BUY' ? 'bought' : 'sold'}{' '}
                      {transaction.quantity} shares of {stock?.name} at ₹
                      {transaction.price}
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
    </div>
  );
}

export default AdminView;
