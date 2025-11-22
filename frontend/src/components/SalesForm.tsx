"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
}

interface SalesItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  total: number
}

interface SalesFormProps {
  onSubmit: (data: any) => void
  onClose: () => void
  products?: Product[]
}

export default function SalesForm({ onSubmit, onClose, products = [] }: SalesFormProps) {
  const [items, setItems] = useState<SalesItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")

  const addItem = () => {
    if (!selectedProduct || !quantity) return

    const product = products.find((p) => p.id === Number(selectedProduct))
    if (!product) return

    const newItem: SalesItem = {
      id: Date.now(),
      productId: Number(selectedProduct),
      productName: product.name,
      price: product.price,
      quantity: Number.parseInt(quantity),
      total: product.price * Number.parseInt(quantity),
    }

    setItems([...items, newItem])
    setSelectedProduct("")
    setQuantity("")
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const total = items.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    onSubmit({
      items,
      total,
      paymentMethod,
      date: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-emerald-800 rounded-lg shadow-xl max-w-2xl w-full border border-emerald-700/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-emerald-700/50 sticky top-0 bg-emerald-800">
          <h2 className="text-lg font-bold text-white">New Sale</h2>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded transition-colors">
            <X className="w-5 h-5 text-emerald-100" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Add Items Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Add Items</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" className="placeholder-emerald-900">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Items</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-emerald-700/50 rounded-lg border border-emerald-600"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-emerald-200 text-sm">
                        {item.quantity} x ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-900/20 rounded transition-colors text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="cash" className="placeholder-emerald-900">Cash</option>
              <option value="card" className="placeholder-emerald-900">Card</option>
              <option value="check" className="placeholder-emerald-900">Check</option>
              <option value="online" className="placeholder-emerald-900">Online</option>
            </select>
          </div>

          {/* Total */}
          {items.length > 0 && (
            <div className="p-4 bg-emerald-700/50 border border-emerald-600 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-emerald-300">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-700 disabled:to-emerald-800 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed"
            >
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}