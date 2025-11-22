import { useState, useEffect } from "react"
import { X } from "lucide-react"
// @ts-ignore
import { supplierService } from "../services/supplierService"

interface Supplier {
  id: number
  name: string
}

interface ProductFormProps {
  onSubmit: (data: any) => void
  onClose: () => void
  initialData?: {
    name: string
    sku: string
    category: string
    price: string | number
    quantity: string | number
    reorderLevel: string | number
    description: string
    supplierId?: string | number
    expiryDate?: string
  } | null
}

export default function ProductForm({ onSubmit, onClose, initialData = null }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    reorderLevel: initialData?.reorderLevel || "",
    description: initialData?.description || "",
    supplierId: initialData?.supplierId || "",
    expiryDate: initialData?.expiryDate || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getAll()
      setSuppliers(response.data.suppliers || response.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.sku.trim()) newErrors.sku = "SKU is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.quantity || Number(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required"
    if (!formData.reorderLevel || Number(formData.reorderLevel) < 0) newErrors.reorderLevel = "Valid reorder level is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.supplierId) newErrors.supplierId = "Supplier is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"
    
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-emerald-800 rounded-2xl shadow-2xl max-w-md w-full border border-emerald-700/50">
        <div className="flex items-center justify-between p-6 border-b border-emerald-700/50">
          <h2 className="text-xl font-bold text-white">{initialData ? "Edit Product" : "Add Product"}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-emerald-100" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.sku ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="Enter SKU"
            />
            {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.category ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all appearance-none cursor-pointer`}
            >
              <option value="" className="placeholder-emerald-900">Select category</option>
              <option value="Tablets">Tablets</option>
              <option value="Capsules">Capsules</option>
              <option value="Syrup">Syrup</option>
              <option value="Injections">Injections</option>
              <option value="Creams">Creams</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 bg-white border ${
                  errors.price ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
                } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-3 bg-white border ${
                  errors.quantity ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
                } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-3 bg-white border ${
                errors.reorderLevel ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="0"
            />
            {errors.reorderLevel && <p className="text-red-400 text-xs mt-1">{errors.reorderLevel}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Supplier</label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.supplierId ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all appearance-none cursor-pointer`}
            >
              <option value="" className="placeholder-emerald-900">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplierId && <p className="text-red-400 text-xs mt-1">{errors.supplierId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.expiryDate ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
            />
            {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 bg-white border ${
                errors.description ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {initialData ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}