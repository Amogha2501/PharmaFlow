import { useContext} from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { LogOut, Menu } from "lucide-react"

interface NavbarProps {
  onMenuToggle: () => void
  role?: string
  pageTitle?: string
}

export default function Navbar({ onMenuToggle, role }: NavbarProps) {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-emerald-800 border-b border-emerald-700 sticky top-0 z-40 shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle} 
            className="lg:hidden p-2 hover:bg-emerald-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-emerald-100" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <img 
                src="/Logo.svg" 
                alt="PharmaFlow Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PharmaFlow</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-3 border-l border-emerald-700">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
              <p className="text-xs text-emerald-200 capitalize">
                Role: {role || user?.role || "admin"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-900/20 rounded-lg transition-colors text-red-300 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}