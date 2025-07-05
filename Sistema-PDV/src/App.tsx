import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Layout/Header'
import Dashboard from './pages/Dashboard'
import Sales from './pages/Sales'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import BusinessTools from './pages/BusinessTools'
import DataManagement from './pages/DataManagement'
import { DatabaseProvider } from './contexts/DatabaseContext'

function App() {
  useEffect(() => {
    // Listener para ações do menu do Electron
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((action: string) => {
        // Aqui podemos adicionar navegação via Electron se necessário
        console.log('Electron menu action:', action)
      })
    }
  }, [])

  return (
    <DatabaseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
          {/* Removido efeitos visuais de gradiente */}
          
          {/* Conteúdo do app com efeito de vidro */}
          <div className="relative z-10">
            <Header />
            
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/business-tools" element={<BusinessTools />} />
                <Route path="/data-management" element={<DataManagement />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </DatabaseProvider>
  )
}

export default App
