import { 
  Bell, 
  Search, 
  User, 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3,
  Store,
  Calculator,
  Database
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'sales', label: 'Vendas', icon: ShoppingCart, path: '/sales' },
  { id: 'products', label: 'Produtos', icon: Package, path: '/products' },
  { id: 'customers', label: 'Clientes', icon: Users, path: '/customers' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, path: '/reports' },
  { id: 'business-tools', label: 'Ferramentas', icon: Calculator, path: '/business-tools' },
  { id: 'data-management', label: 'Dados', icon: Database, path: '/data-management' },
]

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-50 p-2 rounded-lg shadow-sm border border-primary-100">
              <Store className="h-6 w-6 text-primary-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-900">Mercado Betel</h1>
              <p className="text-sm text-primary-700">Sistema PDV</p>
            </div>
          </div>

          {/* Data */}
          <div className="hidden md:block text-sm text-primary-800 font-medium bg-primary-50 px-3 py-1 rounded-full shadow-red-sm">
            {currentDate}
          </div>

          {/* Área de ações */}
          <div className="flex items-center space-x-4">
            {/* Busca rápida */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 bg-white shadow-red-sm"
              />
            </div>

            {/* Notificações */}
            <button className="relative p-2 text-primary-600 hover:text-primary-800 transition-colors rounded-lg hover:bg-primary-50 shadow-red-sm">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center shadow-red-sm">
                3
              </span>
            </button>

            {/* Perfil do usuário */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 shadow-sm border border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shadow-sm border border-primary-200">
                <User className="h-4 w-4 text-primary-700" />
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-primary-900">Administrador</p>
                <p className="text-primary-600 text-xs">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 bg-gradient-to-r from-white to-primary-50">
        <nav className="flex space-x-6 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'border-primary-700 text-primary-800 bg-primary-50 shadow-red-sm font-semibold'
                    : 'border-transparent text-primary-600 hover:text-primary-800 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-700' : 'text-primary-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header
