import React, { useState, useRef, useEffect } from 'react'
import { useDatabase, Product, SaleItem } from '../contexts/DatabaseContext'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone,
  Search,
  X,
  Percent,
  Receipt,
  CheckCircle,
  Clock,
  Users,
  Package
} from 'lucide-react'

const Sales: React.FC = () => {
  const { products, customers, addSale, getProductByBarcode } = useDatabase()
  const [cartItems, setCartItems] = useState<SaleItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discountType, setDiscountType] = useState<'percent' | 'value'>('percent')
  const [discountAmount, setDiscountAmount] = useState('')
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [amountPaid, setAmountPaid] = useState('')
  const [change, setChange] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSale, setLastSale] = useState<any>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0)
  const totalAmount = subtotal - totalDiscount

  // Focar no input de código de barras ao carregar
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [])

  // Retornar foco quando modais são fechados
  useEffect(() => {
    if (!showDiscountModal && !showPaymentModal && !showReceipt && !showProductSearch) {
      focusBarcodeInput()
    }
  }, [showDiscountModal, showPaymentModal, showReceipt, showProductSearch])

  // Verificar se cliente selecionado ainda existe (caso tenha sido deletado)
  useEffect(() => {
    if (selectedCustomer !== null && !customers.some(c => c.id === selectedCustomer)) {
      setSelectedCustomer(null)
      focusBarcodeInput()
    }
  }, [customers, selectedCustomer])

  // Calcular troco quando o valor pago muda
  useEffect(() => {
    const paid = parseFloat(amountPaid) || 0
    setChange(paid - totalAmount)
  }, [amountPaid, totalAmount])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verificar se o foco está em um input, textarea ou element editável
      const activeElement = document.activeElement
      const isInputActive = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      )

      // Se há um input ativo, não interceptar as teclas normais
      if (isInputActive && !['F1', 'F2', 'F12', 'Escape'].includes(e.key) && !e.ctrlKey) {
        return
      }

      // F1 - Focar na busca de produtos
      if (e.key === 'F1') {
        e.preventDefault()
        setShowProductSearch(true)
      }
      // F2 - Abrir modal de desconto
      if (e.key === 'F2' && cartItems.length > 0) {
        e.preventDefault()
        setShowDiscountModal(true)
      }
      // F12 - Finalizar venda
      if (e.key === 'F12' && cartItems.length > 0) {
        e.preventDefault()
        setShowPaymentModal(true)
      }
      // ESC - Fechar modais
      if (e.key === 'Escape') {
        setShowDiscountModal(false)
        setShowPaymentModal(false)
        setShowReceipt(false)
        setShowProductSearch(false)
        focusBarcodeInput() // Retornar foco ao input principal
      }
      // Ctrl+L - Limpar carrinho
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        clearCart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cartItems.length])

  // Função helper para focar no input de código de barras
  const focusBarcodeInput = () => {
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus()
      }
    }, 100)
  }

  // Buscar produto por código de barras
  const handleBarcodeSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barcodeInput.trim()) return

    const product = await getProductByBarcode(barcodeInput.trim())
    if (product) {
      if (product.stock <= 0) {
        alert('Produto sem estoque!')
        return
      }
      addToCart(product)
      setBarcodeInput('')
      focusBarcodeInput() // Manter foco no input
    } else {
      alert('Produto não encontrado!')
    }
  }

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Produto sem estoque!')
      return
    }

    const existingItem = cartItems.find(item => item.product_id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Quantidade maior que o estoque disponível!')
        return
      }
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: SaleItem = {
        id: Date.now(),
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        total_price: product.price
      }
      setCartItems(prev => [...prev, newItem])
    }
    setShowProductSearch(false)
    setSearchProduct('')
    focusBarcodeInput() // Retornar foco ao input principal
  }

  // Atualizar quantidade
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (product && newQuantity > product.stock) {
      alert('Quantidade maior que o estoque disponível!')
      return
    }

    setCartItems(prev => prev.map(item => 
      item.product_id === productId 
        ? { ...item, quantity: newQuantity, total_price: item.unit_price * newQuantity }
        : item
    ))
  }

  // Remover do carrinho
  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId))
  }

  // Aplicar desconto
  const applyDiscount = () => {
    const amount = parseFloat(discountAmount) || 0
    
    if (discountType === 'percent') {
      if (amount > 100) {
        alert('Desconto não pode ser maior que 100%')
        return
      }
      setTotalDiscount((subtotal * amount) / 100)
    } else {
      if (amount > subtotal) {
        alert('Desconto não pode ser maior que o valor total')
        return
      }
      setTotalDiscount(amount)
    }
    
    setShowDiscountModal(false)
    setDiscountAmount('')
    focusBarcodeInput() // Retornar foco ao input principal
  }

  // Limpar desconto
  const clearDiscount = () => {
    setTotalDiscount(0)
    setDiscountAmount('')
  }

  // Limpar carrinho
  const clearCart = () => {
    if (window.confirm('Deseja limpar todo o carrinho?')) {
      setCartItems([])
      setTotalDiscount(0)
      setSelectedCustomer(null)
    }
  }

  // Finalizar venda
  const finalizeSale = async () => {
    if (cartItems.length === 0) {
      alert('Carrinho vazio!')
      return
    }

    if (paymentMethod === 'cash' && change < 0) {
      alert('Valor pago insuficiente!')
      return
    }

    setIsProcessing(true)

    const customerName = selectedCustomer 
      ? customers.find(c => c.id === selectedCustomer)?.name 
      : undefined

    try {
      const saleData = {
        customer_id: selectedCustomer || undefined,
        customer_name: customerName,
        total_amount: totalAmount,
        discount: totalDiscount,
        payment_method: paymentMethod,
        amount_paid: paymentMethod === 'cash' ? parseFloat(amountPaid) : totalAmount,
        change: paymentMethod === 'cash' ? change : 0,
        items: cartItems
      }

      await addSale(saleData)
      setLastSale(saleData)

      // Limpar carrinho
      setCartItems([])
      setSelectedCustomer(null)
      setPaymentMethod('cash')
      setTotalDiscount(0)
      setAmountPaid('')
      setChange(0)
      setShowPaymentModal(false)
      
      // Mostrar recibo
      setShowReceipt(true)
      
      // Focar novamente no input
      focusBarcodeInput()
    } catch (error) {
      alert('Erro ao finalizar venda!')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Produtos filtrados para busca
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.barcode.includes(searchProduct)
  ).slice(0, 10) // Limitar a 10 resultados

  // Handler para focar no input quando clicar no container principal
  const handleContainerClick = (e: React.MouseEvent) => {
    // Se não há modal aberto e não clicou em um input/button
    const target = e.target as HTMLElement
    const isInteractiveElement = target.tagName === 'INPUT' || 
                                 target.tagName === 'BUTTON' || 
                                 target.tagName === 'SELECT' ||
                                 target.closest('button') ||
                                 target.closest('input') ||
                                 target.closest('select')

    if (!showDiscountModal && !showPaymentModal && !showReceipt && !showProductSearch && !isInteractiveElement) {
      focusBarcodeInput()
    }
  }

  return (
    <div className="space-y-6" onClick={handleContainerClick}>
      {/* Header da página */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center text-primary-800">
              <Receipt className="mr-3 text-primary-700" />
              Ponto de Venda
            </h2>
            <p className="text-gray-500">Realize vendas de forma rápida e eficiente</p>
          </div>
          <div className="text-right">
            <p className="text-primary-200">Total do Carrinho</p>
            <p className="text-3xl font-bold">R$ {totalAmount.toFixed(2)}</p>
            {totalDiscount > 0 && (
              <p className="text-primary-100 text-sm">Desconto: R$ {totalDiscount.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área Principal - Produtos e Busca */}
        <div className="lg:col-span-2 space-y-6">
          {/* Busca por Código de Barras */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 text-primary-600" />
              Código de Barras
            </h3>
            <form onSubmit={handleBarcodeSearch} className="flex space-x-2">
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Digite ou escaneie o código de barras..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                tabIndex={1}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">
              Pressione Enter ou clique no botão para buscar
            </p>
          </div>

          {/* Busca Manual de Produtos */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Search className="mr-2 text-primary-600" />
                  Buscar Produtos
                </h3>
                <button
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50"
                >
                  {showProductSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {showProductSearch && (
              <div className="p-6">
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Digite o nome do produto..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                  autoComplete="off"
                />
                
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      {searchProduct ? 'Nenhum produto encontrado' : 'Digite para buscar produtos'}
                    </p>
                  ) : (
                    filteredProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          product.stock <= 0 
                            ? 'border-red-200 bg-red-50 cursor-not-allowed' 
                            : 'border-gray-200 hover:bg-gray-50 hover:border-red-300'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">Código: {product.barcode}</p>
                          <p className={`text-sm font-medium ${
                            product.stock <= 0 ? 'text-red-500' : 
                            product.stock <= 5 ? 'text-primary-700' : 'text-primary-600'
                          }`}>
                            Estoque: {product.stock}
                            {product.stock <= 0 && ' - SEM ESTOQUE'}
                            {product.stock > 0 && product.stock <= 5 && ' - ESTOQUE BAIXO'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600 text-lg">
                            R$ {product.price.toFixed(2)}
                          </p>
                          {product.stock > 0 && (
                            <Plus className="h-4 w-4 text-red-500 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carrinho e Finalização */}
        <div className="space-y-6">
          {/* Resumo rápido */}
          <div className="bg-white rounded-xl shadow-lg p-4 text-gray-800 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Itens no Carrinho</p>
                <p className="text-2xl font-bold text-primary-800">{cartItems.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary-700" />
            </div>
          </div>

          {/* Carrinho */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-red-500" />
                  Carrinho ({cartItems.length})
                </h3>
                {cartItems.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDiscountModal(true)}
                      className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Percent className="h-4 w-4 mr-1" />
                      Desconto
                    </button>
                    <button
                      onClick={clearCart}
                      className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Limpar
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Carrinho vazio</p>
                  <p className="text-gray-400 text-sm">Escaneie um código de barras ou busque produtos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => {
                    const product = products.find(p => p.id === item.product_id)
                    const stockAvailable = product?.stock || 0
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">R$ {item.unit_price.toFixed(2)} cada</p>
                          <p className={`text-xs ${stockAvailable < item.quantity ? 'text-red-500' : 'text-gray-400'}`}>
                            Estoque disponível: {stockAvailable}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            
                            <span className="px-3 py-1 bg-gray-100 rounded min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="text-right min-w-[5rem]">
                            <p className="font-semibold text-red-600 text-lg">
                              R$ {item.total_price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Resumo dos totais */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between items-center text-red-600">
                        <span>Desconto:</span>
                        <div className="flex items-center space-x-2">
                          <span>- R$ {totalDiscount.toFixed(2)}</span>
                          <button
                            onClick={clearDiscount}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remover desconto"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-red-600 border-t pt-2">
                      <span>Total:</span>
                      <span>R$ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cliente e Pagamento */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 space-y-6">
                {/* Cliente */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Cliente (Opcional)
                  </label>
                  <select
                    value={customers.some(c => c.id === selectedCustomer) ? String(selectedCustomer) : ''}
                    onChange={e => setSelectedCustomer(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Cliente Avulso</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span className="font-medium">Dinheiro</span>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="font-medium">Cartão</span>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'pix' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span className="font-medium">PIX</span>
                    </button>
                  </div>
                </div>

                {/* Valor pago e troco (apenas para dinheiro) */}
                {paymentMethod === 'cash' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor Recebido
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          placeholder="0,00"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                        />
                      </div>
                    </div>
                    
                    {amountPaid && (
                      <div className={`p-3 rounded-lg ${change >= 0 ? 'bg-red-100 text-red-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Troco:</span>
                          <span className="text-xl font-bold">
                            R$ {Math.abs(change).toFixed(2)}
                            {change < 0 && ' (FALTA)'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Botão Finalizar */}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isProcessing || (paymentMethod === 'cash' && change < 0)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isProcessing || (paymentMethod === 'cash' && change < 0)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Clock className="animate-spin h-5 w-5 mr-2" />
                      Processando...
                    </div>
                  ) : (
                    `Finalizar Venda - R$ ${totalAmount.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Desconto */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Percent className="mr-2 text-red-500" />
              Aplicar Desconto
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Desconto</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDiscountType('percent')}
                    className={`p-3 border rounded-lg text-center ${
                      discountType === 'percent' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    Porcentagem (%)
                  </button>
                  <button
                    onClick={() => setDiscountType('value')}
                    className={`p-3 border rounded-lg text-center ${
                      discountType === 'value' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    Valor (R$)
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {discountType === 'percent' ? 'Porcentagem de Desconto' : 'Valor do Desconto'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder={discountType === 'percent' ? '0' : '0,00'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {discountType === 'percent' ? '%' : 'R$'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyDiscount}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Aplicar Desconto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="mr-2 text-red-500" />
              Confirmar Venda
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Desconto:</span>
                    <span>- R$ {totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-red-600">R$ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Forma de Pagamento:</span>
                  <span className="capitalize">{
                    paymentMethod === 'cash' ? 'Dinheiro' : 
                    paymentMethod === 'card' ? 'Cartão' : 'PIX'
                  }</span>
                </div>
                {paymentMethod === 'cash' && amountPaid && (
                  <>
                    <div className="flex justify-between">
                      <span>Valor Recebido:</span>
                      <span>R$ {parseFloat(amountPaid).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Troco:</span>
                      <span>R$ {change.toFixed(2)}</span>
                    </div>
                  </>
                )}
                {selectedCustomer && (
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span>{customers.find(c => c.id === selectedCustomer)?.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={finalizeSale}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                >
                  {isProcessing ? 'Processando...' : 'Confirmar Venda'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Recibo */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-600 mb-2">Venda Realizada!</h3>
              <p className="text-gray-600">Obrigado pela preferência</p>
            </div>
            
            {/* Recibo */}
            <div className="border-2 border-dashed border-gray-300 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="text-center border-b pb-2">
                <h4 className="font-bold">MERCADO BETEL</h4>
                <p className="text-sm text-gray-600">Cupom Fiscal Simplificado</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleString('pt-BR')}</p>
              </div>
              
              <div className="space-y-1">
                {lastSale.items.map((item: any, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>{item.product_name}</span>
                      <span>R$ {item.total_price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      {item.quantity}x R$ {item.unit_price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {(lastSale.total_amount + lastSale.discount).toFixed(2)}</span>
                </div>
                {lastSale.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Desconto:</span>
                    <span>- R$ {lastSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>TOTAL:</span>
                  <span>R$ {lastSale.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pagamento:</span>
                  <span className="capitalize">
                    {lastSale.payment_method === 'cash' ? 'Dinheiro' : 
                     lastSale.payment_method === 'card' ? 'Cartão' : 'PIX'}
                  </span>
                </div>
                {lastSale.payment_method === 'cash' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Recebido:</span>
                      <span>R$ {lastSale.amount_paid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Troco:</span>
                      <span>R$ {lastSale.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
                {lastSale.customer_name && (
                  <div className="flex justify-between text-sm">
                    <span>Cliente:</span>
                    <span>{lastSale.customer_name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Atalhos de teclado */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600 border border-gray-200">
        <div className="font-semibold mb-2 text-gray-800">Atalhos:</div>
        <div className="space-y-1">
          <p><kbd className="bg-gray-100 px-2 py-1 rounded text-xs">F1</kbd> Buscar produto</p>
          <p><kbd className="bg-gray-100 px-2 py-1 rounded text-xs">F2</kbd> Desconto</p>
          <p><kbd className="bg-gray-100 px-2 py-1 rounded text-xs">F12</kbd> Finalizar</p>
          <p><kbd className="bg-gray-100 px-1 py-1 rounded text-xs">Ctrl+L</kbd> Limpar</p>
          <p><kbd className="bg-gray-100 px-2 py-1 rounded text-xs">ESC</kbd> Fechar</p>
        </div>
      </div>
    </div>
  )
}

export default Sales
