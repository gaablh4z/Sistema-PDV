import React, { useState } from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { 
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  HardDrive,
  FileText,
  Settings
} from 'lucide-react'

const DataManagement: React.FC = () => {
  const { 
    exportData, 
    importData, 
    clearAllData, 
    refreshData, 
    getStorageInfo 
  } = useDatabase()
  
  const [importFile, setImportFile] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  
  const storageInfo = getStorageInfo()

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pdv-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showMessage('success', 'Backup exportado com sucesso!')
    } catch (error) {
      showMessage('error', 'Erro ao exportar dados')
    }
  }

  const handleImport = async () => {
    if (!importFile.trim()) {
      showMessage('error', 'Cole os dados JSON para importar')
      return
    }

    setIsLoading(true)
    try {
      await importData(importFile)
      setImportFile('')
      showMessage('success', 'Dados importados com sucesso!')
    } catch (error) {
      showMessage('error', 'Erro ao importar dados: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!window.confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema (produtos, clientes, vendas). Esta ação é IRREVERSÍVEL. Tem certeza?')) {
      return
    }

    if (!window.confirm('Última confirmação: Deseja realmente apagar todos os dados? Digite "CONFIRMAR" no próximo prompt.')) {
      return
    }

    const confirmation = window.prompt('Digite "CONFIRMAR" para apagar todos os dados:')
    if (confirmation !== 'CONFIRMAR') {
      showMessage('info', 'Operação cancelada')
      return
    }

    setIsLoading(true)
    try {
      await clearAllData()
      showMessage('success', 'Todos os dados foram removidos')
    } catch (error) {
      showMessage('error', 'Erro ao limpar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await refreshData()
      showMessage('success', 'Dados recarregados')
    } catch (error) {
      showMessage('error', 'Erro ao recarregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 border border-gray-200">
        <div className="flex items-center">
          <Database className="mr-3 h-8 w-8 text-primary-700" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-primary-800">Gerenciamento de Dados</h2>
            <p className="text-gray-500">Backup, importação e configurações do banco de dados</p>
          </div>
        </div>
      </div>

      {/* Mensagem de Status */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-red-100 text-red-800 border border-red-200' :
          message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
           message.type === 'error' ? <AlertTriangle className="h-5 w-5" /> :
           <Settings className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Sistema */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HardDrive className="mr-2 text-red-500" />
            Informações do Sistema
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Produtos Cadastrados</p>
                  <p className="text-2xl font-bold text-red-600">{storageInfo.products}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clientes Cadastrados</p>
                  <p className="text-2xl font-bold text-red-600">{storageInfo.customers}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vendas Realizadas</p>
                  <p className="text-2xl font-bold text-red-600">{storageInfo.sales}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tamanho dos Dados</p>
                  <p className="text-2xl font-bold text-red-600">{storageInfo.totalSize}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Armazenamento Local</p>
                  <p className="text-xs text-red-700">
                    Os dados estão salvos no localStorage do navegador. 
                    Faça backups regulares para não perder informações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações de Backup */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="mr-2 text-red-500" />
            Backup e Restauração
          </h3>
          
          <div className="space-y-4">
            {/* Exportar Dados */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Exportar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">
                Baixe um arquivo JSON com todos os dados do sistema
              </p>
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Backup</span>
              </button>
            </div>

            {/* Importar Dados */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Importar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">
                Cole o conteúdo de um arquivo de backup JSON
              </p>
              <textarea
                value={importFile}
                onChange={(e) => setImportFile(e.target.value)}
                placeholder="Cole aqui o conteúdo do arquivo JSON..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleImport}
                disabled={isLoading || !importFile.trim()}
                className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>{isLoading ? 'Importando...' : 'Importar Dados'}</span>
              </button>
            </div>

            {/* Atualizar */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Recarregar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">
                Recarrega os dados do localStorage
              </p>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Recarregando...' : 'Recarregar Dados'}</span>
              </button>
            </div>

            {/* Limpar Tudo */}
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">⚠️ Zona de Perigo</h4>
              <p className="text-sm text-red-700 mb-3">
                Remove TODOS os dados permanentemente. Ação irreversível!
              </p>
              <button
                onClick={handleClearData}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isLoading ? 'Limpando...' : 'Apagar Todos os Dados'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Informações Técnicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Armazenamento</h4>
            <p className="text-sm text-blue-700">localStorage (Navegador)</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">Persistência</h4>
            <p className="text-sm text-green-700">Automática ao modificar dados</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">Formato</h4>
            <p className="text-sm text-purple-700">JSON estruturado</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Local de Armazenamento:</h4>
          <div className="text-sm text-gray-600 font-mono">
            <p>• localStorage['pdv_products'] - Produtos</p>
            <p>• localStorage['pdv_customers'] - Clientes</p>
            <p>• localStorage['pdv_sales'] - Vendas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataManagement
