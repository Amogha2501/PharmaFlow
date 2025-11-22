"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface SupplierFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  paymentTerms: string
}

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => void
  onClose: () => void
  initialData?: SupplierFormData | null
}

export default function SupplierForm({ onSubmit, onClose, initialData = null }: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>(
    initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      paymentTerms: "",
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.name.trim()) newErrors.name = "Supplier name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.paymentTerms.trim()) newErrors.paymentTerms = "Payment terms are required"
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
          <h2 className="text-xl font-bold text-white">{initialData ? "Edit Supplier" : "Add Supplier"}</h2>
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
            <label className="block text-sm font-medium text-emerald-100 mb-2">Supplier Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="Enter supplier name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="supplier@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.phone ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.address ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="Street address"
            />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.city ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
                } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-100 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.country ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
                } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
                placeholder="Country"
              />
              {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-2">Payment Terms</label>
            <input
              type="text"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.paymentTerms ? "border-red-500 focus:ring-red-500" : "border-emerald-300 focus:ring-emerald-500"
              } rounded-xl text-emerald-900 placeholder-emerald-900 focus:outline-none focus:border-emerald-500 focus:ring-2 transition-all`}
              placeholder="e.g., Net 30"
            />
            {errors.paymentTerms && <p className="text-red-400 text-xs mt-1">{errors.paymentTerms}</p>}
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
              {initialData ? "Update" : "Add"} Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}