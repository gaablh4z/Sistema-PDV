import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { useDatabase, Product } from '../contexts/DatabaseContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search,
  AlertTriangle,
  Filter,
  RefreshCw,
  Tag,
  DollarSign,
  BarChart,
  ScanLine,
  AlertCircle
} from 'lucide-react'

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useDatabase()
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''})
  const [stockFilter, setStockFilter] = useState<string>('todos') // 'todos', 'baixo', 'normal'
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    price: '',
    cost: '',
    stock: '',
    category: '',
    description: ''
  })
  const [key, setKey] = useState(Date.now()) // Chave única para forçar re-renderização
  
  // Referência para o primeiro campo do formulário
  const nameInputRef = useRef<HTMLInputElement>(null)
  // Referência para o campo de código de barras
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  // Estado para controlar quando estamos em modo de leitura de código de barras
  const [barcodeReaderMode, setBarcodeReaderMode] = useState(false)
  // Estado para mensagens de feedback ao usuário
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null)

  // Monitorar exclusões para resetar o estado do formulário se o produto sendo editado for excluído
  useEffect(() => {
    if (editingProduct && !products.some(p => p.id === editingProduct.id)) {
      closeModal()
    }
  }, [products, editingProduct])

  // Focar no primeiro campo ao abrir o modal
  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        // Se for um produto novo, focar no código de barras para leitura imediata
        if (!editingProduct && barcodeInputRef.current) {
          barcodeInputRef.current.focus()
          setBarcodeReaderMode(true)
          setFeedback({
            message: 'Pronto para leitura do código de barras',
            type: 'info'
          })
        } 
        // Se estiver editando, focar no nome do produto
        else if (nameInputRef.current) {
          nameInputRef.current.focus()
        }
      }, 100)
    } else {
      // Limpar feedback quando o modal é fechado
      setFeedback(null)
      setBarcodeReaderMode(false)
    }
  }, [showModal, editingProduct])

  const filteredProducts = products.filter(product => {
    // Filtragem por termo de busca
    const matchesSearchTerm = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtragem por categoria
    const matchesCategory = 
      selectedCategory === '' || product.category === selectedCategory;
    
    // Filtragem por faixa de preço
    const matchesPriceRange = 
      (priceRange.min === '' || product.price >= parseFloat(priceRange.min)) &&
      (priceRange.max === '' || product.price <= parseFloat(priceRange.max));
    
    // Filtragem por estoque
    const matchesStockFilter = 
      stockFilter === 'todos' ||
      (stockFilter === 'baixo' && product.stock <= 10) ||
      (stockFilter === 'normal' && product.stock > 10);

    return matchesSearchTerm && matchesCategory && matchesPriceRange && matchesStockFilter;
  })

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        barcode: product.barcode,
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock: product.stock.toString(),
        category: product.category,
        description: product.description || ''
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        barcode: '',
        price: '',
        cost: '',
        stock: '',
        category: '',
        description: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      barcode: '',
      price: '',
      cost: '',
      stock: '',
      category: '',
      description: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      barcode: formData.barcode,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await addProduct(productData)
      }
      closeModal()
    } catch (error) {
      alert('Erro ao salvar produto!')
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id)
        
        // Verificar se há algum modal aberto e fechá-lo
        if (showModal) {
          closeModal()
        }
        
        // Forçar re-renderização com nova key antes de recarregar
        setKey(Date.now())
        
        // Solução mais radical: recarregar a página completamente
        window.location.reload()
      } catch (error) {
        alert('Erro ao excluir produto!')
        console.error(error)
      }
    }
  }

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

  // Efeito para garantir que o DOM seja completamente reconstruído após uma re-renderização
  useEffect(() => {
    // Quando o componente é re-renderizado (via key), garantimos que o DOM está "fresco"
    const fixFocusIssues = () => {
      // Remover qualquer foco ativo
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      
      // Forçar uma atualização do layout do navegador
      document.body.style.display = 'none'
      void document.body.offsetHeight
      document.body.style.display = ''
      
      // Restaurar o foco para o campo de busca
      setTimeout(() => {
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }, 50)
    }
    
    fixFocusIssues()
    
    // Função que será chamada quando o usuário retornar ao aplicativo após minimizar
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fixFocusIssues()
      }
    }
    
    // Adicionar listener para o evento de mudança de visibilidade
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Remover listener ao desmontar o componente
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [key]) // Executar sempre que a key mudar (após uma exclusão)

  // Processar a leitura do código de barras
  const handleBarcodeInput = (e: KeyboardEvent<HTMLInputElement>) => {
    // Os leitores de código de barras geralmente terminam com Enter
    if (e.key === 'Enter' && barcodeReaderMode) {
      e.preventDefault() // Evitar o envio do formulário
      
      // Verificar se temos um código de barras válido
      const barcode = formData.barcode.trim()
      if (!barcode) {
        setFeedback({
          message: 'Código de barras não detectado, tente novamente',
          type: 'error'
        })
        return
      }
      
      // Verificar se o código já existe no sistema
      const existingProduct = products.find(p => p.barcode === barcode)
      if (existingProduct) {
        setFeedback({
          message: `Este código já está registrado para o produto: ${existingProduct.name}`,
          type: 'error'
        })
        return
      }
      
      // Código de barras lido com sucesso
      setFeedback({
        message: `Código de barras ${barcode} lido com sucesso!`,
        type: 'success'
      })
      
      // Focar no próximo campo (nome do produto)
      nameInputRef.current?.focus()
      setBarcodeReaderMode(false)
    }
  }

  // Alternar o modo de leitura de código de barras
  const toggleBarcodeReaderMode = () => {
    setBarcodeReaderMode(!barcodeReaderMode)
    if (!barcodeReaderMode) {
      // Limpar o campo e focar nele
      setFormData({ ...formData, barcode: '' })
      setFeedback({
        message: 'Pronto para leitura do código de barras',
        type: 'info'
      })
      setTimeout(() => barcodeInputRef.current?.focus(), 100)
    } else {
      setFeedback(null)
    }
  }

  return (
    <div className="space-y-6" key={key}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, código de barras ou categoria..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por categoria */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Tag className="h-4 w-4 mr-1" />
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro por faixa de preço */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Faixa de Preço (R$)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">a</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filtro por estoque */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <BarChart className="h-4 w-4 mr-1" />
                Situação do Estoque
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os níveis</option>
                <option value="baixo">Estoque baixo (≤ 10)</option>
                <option value="normal">Estoque normal (&gt; 10)</option>
              </select>
            </div>
          </div>

          {/* Botões de ação dos filtros */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange({min: '', max: ''});
                setStockFilter('todos');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </button>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center text-sm text-gray-500">
            <Filter className="h-4 w-4 mr-2" />
            {filteredProducts.length === 0 ? (
              'Nenhum produto encontrado'
            ) : (
              `${filteredProducts.length} produto(s) encontrado(s)`
            )}
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Barras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500">{product.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-mono">{product.barcode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-semibold">
                      R$ {product.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Custo: R$ {product.cost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock <= 5 
                          ? 'bg-primary-200 text-primary-900' 
                          : product.stock <= 10
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-primary-50 text-primary-700'
                      }`}>
                        {product.stock} unidades
                      </span>
                      {product.stock <= 10 && (
                        <AlertTriangle className="h-4 w-4 text-primary-600 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(product)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    ref={nameInputRef}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</span>
                    <button 
                      type="button"
                      onClick={toggleBarcodeReaderMode}
                      className={`text-xs flex items-center ${barcodeReaderMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'} px-2 py-1 rounded-md`}
                    >
                      <ScanLine className="h-3 w-3 mr-1" />
                      {barcodeReaderMode ? 'Modo Leitura Ativo' : 'Ativar Leitor'}
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      onKeyDown={handleBarcodeInput}
                      ref={barcodeInputRef}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        barcodeReaderMode 
                          ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder={barcodeReaderMode ? "Aguardando leitura..." : "Digite ou escaneie o código"}
                    />
                    {barcodeReaderMode && (
                      <ScanLine className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600 animate-pulse" />
                    )}
                  </div>
                  {feedback && (
                    <div className={`mt-1 text-sm flex items-center ${
                      feedback.type === 'success' ? 'text-green-600' : 
                      feedback.type === 'error' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {feedback.type === 'success' ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feedback.message}
                        </span>
                      ) : feedback.type === 'error' ? (
                        <span className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {feedback.message}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ScanLine className="w-4 h-4 mr-1" />
                          {feedback.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custo</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="categories"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <datalist id="categories">
                      {categories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    {editingProduct ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
