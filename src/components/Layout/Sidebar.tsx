import React from 'react'
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'sales', label: 'Vendas', icon: ShoppingCart, path: '/sales' },
  { id: 'products', label: 'Produtos', icon: Package, path: '/products' },
  { id: 'customers', label: 'Clientes', icon: Users, path: '/customers' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, path: '/reports' },
  { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
]

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="bg-white text-gray-800 w-64 min-h-screen flex flex-col shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Store className="h-8 w-8 text-primary-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-800">Mercado Betel</h1>
            <p className="text-gray-500 text-sm">Sistema PDV</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-3 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-50 text-primary-800 shadow-sm border border-primary-100'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-700 hover:translate-x-1'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-700' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 Mercado Betel</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
