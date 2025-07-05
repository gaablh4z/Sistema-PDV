import React from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertTriangle
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const { products, customers, sales } = useDatabase()

  // Cálculos para as métricas
  const totalProducts = products.length
  const totalCustomers = customers.length
  const totalSales = sales.length
  
  const todaySales = sales.filter(sale => {
    const today = new Date().toDateString()
    const saleDate = new Date(sale.created_at).toDateString()
    return today === saleDate
  })

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0)
  const lowStockProducts = products.filter(product => product.stock <= 10)

  const statsCards = [
    {
      title: 'Vendas Hoje',
      value: todaySales.length.toString(),
      icon: ShoppingCart,
      color: 'bg-primary-600',
      change: '+12%'
    },
    {
      title: 'Faturamento Hoje',
      value: `R$ ${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-primary-700',
      change: '+8%'
    },
    {
      title: 'Produtos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'bg-primary-800',
      change: '+3'
    },
    {
      title: 'Clientes',
      value: totalCustomers.toString(),
      icon: Users,
      color: 'bg-primary-900',
      change: '+5'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-primary-800 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Mercado Betel!</h1>
          <p className="text-primary-600">Gerencie seu negócio de forma simples e eficiente</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-primary-600" />
                <span className="text-sm text-primary-700 ml-1">{card.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs ontem</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Recentes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-primary-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-700" />
              Vendas Recentes
            </h3>
          </div>
          <div className="p-6">
            {sales.slice(-5).reverse().map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {sale.customer_name || 'Cliente Avulso'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(sale.created_at).toLocaleDateString('pt-BR')} - {sale.payment_method.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-700">
                    R$ {sale.total_amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sale.items.length} item(s)
                  </p>
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhuma venda encontrada</p>
            )}
          </div>
        </div>

        {/* Produtos com Estoque Baixo */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-primary-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary-600" />
              Estoque Baixo
            </h3>
          </div>
          <div className="p-6">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock <= 5 
                      ? 'bg-primary-100 text-primary-900' 
                      : 'bg-primary-50 text-primary-800'
                  }`}>
                    {product.stock} unidades
                  </span>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">Todos os produtos com estoque adequado</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="bg-white rounded-lg p-6 text-gray-800 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-primary-800">Resumo do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-700">{totalSales}</div>
            <div className="text-gray-500">Total de Vendas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-700">R$ {sales.reduce((sum, sale) => sum + sale.total_amount, 0).toFixed(2)}</div>
            <div className="text-gray-500">Faturamento Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-700">{products.reduce((sum, product) => sum + product.stock, 0)}</div>
            <div className="text-gray-500">Itens em Estoque</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
