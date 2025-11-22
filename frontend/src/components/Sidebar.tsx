"use client"

import { Link, useLocation } from "react-router-dom"
import { X, LayoutDashboard, Package, Truck, Receipt, BarChart3 } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: Truck, label: "Suppliers", path: "/suppliers" },
    { icon: Receipt, label: "Sales", path: "/sales" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-emerald-800 border-r border-emerald-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-emerald-700 bg-emerald-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src="/logo2.svg" 
              alt="PharmaFlow Logo" 
              className="w-10 h-10 rounded-lg shadow-md border border-white/20 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white truncate">PharmaFlow</h1>
              <p className="text-xs text-emerald-200 truncate">Admin Dashboard</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-700 rounded-md transition-colors lg:hidden focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-emerald-100" />
          </button>
        </div>

        <nav className="p-2 mt-1">
          <ul className="space-y-0.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2.5 px-2.5 py-2 text-emerald-100 hover:bg-emerald-700 hover:text-white rounded-md transition-all duration-200 ${
                      isActive 
                        ? "bg-emerald-600/30 text-white border-r-2 border-emerald-400 shadow-xs" 
                        : ""
                    }`}
                    onClick={onClose}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-emerald-700">
          <div className="bg-emerald-700/50 rounded-md p-2">
            <p className="text-xs text-emerald-200 truncate">PharmaFlow System</p>
            <p className="text-xs text-emerald-300 mt-0.5">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}