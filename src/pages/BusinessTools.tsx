import React, { useState } from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { 
  Calculator, 
  Scale, 
  Package,
  AlertTriangle,
  TrendingUp,
  Minus,
  ArrowLeftRight,
  Banknote,
  Truck,
  Trash2
} from 'lucide-react'

const BusinessTools: React.FC = () => {
  const { products } = useDatabase()
  const [calculatorValues, setCalculatorValues] = useState({
    cost: '',
    markup: '',
    sellPrice: '',
    profit: ''
  })

  const [weightCalculator, setWeightCalculator] = useState({
    weight: '',
    pricePerKg: '',
    totalPrice: ''
  })

  const [discountCalculator, setDiscountCalculator] = useState({
    originalPrice: '',
    discountPercent: '',
    discountValue: '',
    finalPrice: ''
  })

  const [unitConverter, setUnitConverter] = useState({
    value: '',
    fromUnit: 'kg',
    toUnit: 'g',
    result: ''
  })

  const [changeCalculator, setChangeCalculator] = useState({
    totalSale: '',
    amountPaid: '',
    change: ''
  })

  const [deliveryCalculator, setDeliveryCalculator] = useState({
    distance: '',
    baseRate: '5.00',
    perKmRate: '2.00',
    totalDelivery: ''
  })

  const [lossTracker, setLossTracker] = useState({
    productName: '',
    quantity: '',
    reason: 'vencido',
    value: ''
  })

  // Calculadora de Desconto
  const handleDiscountChange = (field: string, value: string) => {
    const newValues = { ...discountCalculator, [field]: value }
    
    if (field === 'originalPrice' || field === 'discountPercent') {
      const originalPrice = parseFloat(newValues.originalPrice) || 0
      const discountPercent = parseFloat(newValues.discountPercent) || 0
      
      if (originalPrice > 0 && discountPercent >= 0) {
        const discountValue = (originalPrice * discountPercent / 100)
        const finalPrice = originalPrice - discountValue
        newValues.discountValue = discountValue.toFixed(2)
        newValues.finalPrice = finalPrice.toFixed(2)
      }
    }
    
    setDiscountCalculator(newValues)
  }

  // Conversor de Unidades
  const convertUnits = (value: number, from: string, to: string) => {
    const conversions: { [key: string]: number } = {
      // Peso
      'kg': 1000, 'g': 1, 'mg': 0.001, 'ton': 1000000,
      // Volume
      'l': 1000, 'ml': 1, 'cl': 10,
      // Distância
      'km': 1000000, 'm': 1000, 'cm': 10, 'mm': 1
    }
    
    const baseValue = value * (conversions[from] || 1)
    return baseValue / (conversions[to] || 1)
  }

  const handleUnitConversion = (field: string, value: string) => {
    const newValues = { ...unitConverter, [field]: value }
    
    if (field === 'value' || field === 'fromUnit' || field === 'toUnit') {
      const inputValue = parseFloat(newValues.value) || 0
      if (inputValue > 0) {
        const result = convertUnits(inputValue, newValues.fromUnit, newValues.toUnit)
        newValues.result = result.toFixed(3)
      } else {
        newValues.result = ''
      }
    }
    
    setUnitConverter(newValues)
  }

  // Calculadora de Troco
  const handleChangeCalculation = (field: string, value: string) => {
    const newValues = { ...changeCalculator, [field]: value }
    
    if (field === 'totalSale' || field === 'amountPaid') {
      const totalSale = parseFloat(newValues.totalSale) || 0
      const amountPaid = parseFloat(newValues.amountPaid) || 0
      
      if (totalSale > 0 && amountPaid > 0) {
        const change = amountPaid - totalSale
        newValues.change = change.toFixed(2)
      } else {
        newValues.change = ''
      }
    }
    
    setChangeCalculator(newValues)
  }

  // Calculadora de Frete
  const handleDeliveryCalculation = (field: string, value: string) => {
    const newValues = { ...deliveryCalculator, [field]: value }
    
    if (field === 'distance' || field === 'baseRate' || field === 'perKmRate') {
      const distance = parseFloat(newValues.distance) || 0
      const baseRate = parseFloat(newValues.baseRate) || 0
      const perKmRate = parseFloat(newValues.perKmRate) || 0
      
      if (distance > 0) {
        const totalDelivery = baseRate + (distance * perKmRate)
        newValues.totalDelivery = totalDelivery.toFixed(2)
      } else {
        newValues.totalDelivery = ''
      }
    }
    
    setDeliveryCalculator(newValues)
  }

  // Calculadora de Margem
  const calculateMarkup = (cost: number, markup: number) => {
    const sellPrice = cost * (1 + markup / 100)
    const profit = sellPrice - cost
    return { sellPrice, profit }
  }

  const handleCostChange = (value: string) => {
    const cost = parseFloat(value) || 0
    const markup = parseFloat(calculatorValues.markup) || 0
    
    if (cost > 0 && markup > 0) {
      const { sellPrice, profit } = calculateMarkup(cost, markup)
      setCalculatorValues({
        cost: value,
        markup: calculatorValues.markup,
        sellPrice: sellPrice.toFixed(2),
        profit: profit.toFixed(2)
      })
    } else {
      setCalculatorValues({ ...calculatorValues, cost: value })
    }
  }

  const handleMarkupChange = (value: string) => {
    const cost = parseFloat(calculatorValues.cost) || 0
    const markup = parseFloat(value) || 0
    
    if (cost > 0 && markup > 0) {
      const { sellPrice, profit } = calculateMarkup(cost, markup)
      setCalculatorValues({
        cost: calculatorValues.cost,
        markup: value,
        sellPrice: sellPrice.toFixed(2),
        profit: profit.toFixed(2)
      })
    } else {
      setCalculatorValues({ ...calculatorValues, markup: value })
    }
  }

  // Calculadora de Peso
  const handleWeightChange = (field: string, value: string) => {
    const newValues = { ...weightCalculator, [field]: value }
    
    if (field === 'weight' || field === 'pricePerKg') {
      const weight = parseFloat(newValues.weight) || 0
      const pricePerKg = parseFloat(newValues.pricePerKg) || 0
      
      if (weight > 0 && pricePerKg > 0) {
        newValues.totalPrice = (weight * pricePerKg).toFixed(2)
      }
    }
    
    setWeightCalculator(newValues)
  }

  // Análise de Produtos
  const lowStockProducts = products.filter(p => p.stock <= 10)
  const highMarginProducts = products
    .map(p => ({ ...p, margin: ((p.price - p.cost) / p.cost) * 100 }))
    .filter(p => p.margin > 50)
    .sort((a, b) => b.margin - a.margin)

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.cost * p.stock), 0)
  const potentialRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-primary-800">🛠️ Ferramentas do Negócio</h2>
        <p className="text-gray-500">Calculadoras e análises para otimizar seu mercado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculadora de Margem */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-red-500" />
              Calculadora de Margem
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={calculatorValues.cost}
                onChange={(e) => handleCostChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Margem (%)</label>
              <input
                type="number"
                step="0.1"
                value={calculatorValues.markup}
                onChange={(e) => handleMarkupChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Preço de Venda</p>
                  <p className="text-lg font-bold text-red-600">
                    R$ {calculatorValues.sellPrice || '0,00'}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Lucro</p>
                  <p className="text-lg font-bold text-red-600">
                    R$ {calculatorValues.profit || '0,00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculadora de Peso */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-red-500" />
              Calculadora de Peso
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peso (Kg)</label>
              <input
                type="number"
                step="0.001"
                value={weightCalculator.weight}
                onChange={(e) => handleWeightChange('weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço por Kg (R$)</label>
              <input
                type="number"
                step="0.01"
                value={weightCalculator.pricePerKg}
                onChange={(e) => handleWeightChange('pricePerKg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Total a Pagar</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {weightCalculator.totalPrice || '0,00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análises do Negócio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Valor do Estoque */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-red-500" />
              Valor do Estoque
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Investimento Total</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {totalInventoryValue.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Receita Potencial</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {potentialRevenue.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lucro Potencial</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {(potentialRevenue - totalInventoryValue).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Produtos com Estoque Baixo */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Estoque Baixo
            </h3>
          </div>
          <div className="p-6">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                      {product.stock} un.
                    </span>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{lowStockProducts.length - 5} produtos com estoque baixo
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Todos os produtos têm estoque adequado</p>
            )}
          </div>
        </div>

        {/* Produtos de Alta Margem */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
              Alta Margem
            </h3>
          </div>
          <div className="p-6">
            {highMarginProducts.length > 0 ? (
              <div className="space-y-3">
                {highMarginProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                      {product.margin.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {highMarginProducts.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{highMarginProducts.length - 5} produtos rentáveis
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum produto com margem alta encontrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Novas Ferramentas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Calculadora de Desconto */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Minus className="h-5 w-5 mr-2 text-red-500" />
              Calculadora de Desconto
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço Original (R$)</label>
              <input
                type="number"
                step="0.01"
                value={discountCalculator.originalPrice}
                onChange={(e) => handleDiscountChange('originalPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto (%)</label>
              <input
                type="number"
                step="0.1"
                value={discountCalculator.discountPercent}
                onChange={(e) => handleDiscountChange('discountPercent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Desconto:</span>
                <span className="font-medium text-red-600">R$ {discountCalculator.discountValue || '0,00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Preço Final:</span>
                <span className="font-bold text-red-600">R$ {discountCalculator.finalPrice || '0,00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversor de Unidades */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowLeftRight className="h-5 w-5 mr-2 text-red-500" />
              Conversor de Unidades
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
              <input
                type="number"
                step="0.001"
                value={unitConverter.value}
                onChange={(e) => handleUnitConversion('value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">De</label>
                <select
                  value={unitConverter.fromUnit}
                  onChange={(e) => handleUnitConversion('fromUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <optgroup label="Peso">
                    <option value="kg">Quilograma</option>
                    <option value="g">Grama</option>
                    <option value="mg">Miligrama</option>
                    <option value="ton">Tonelada</option>
                  </optgroup>
                  <optgroup label="Volume">
                    <option value="l">Litro</option>
                    <option value="ml">Mililitro</option>
                    <option value="cl">Centilitro</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Para</label>
                <select
                  value={unitConverter.toUnit}
                  onChange={(e) => handleUnitConversion('toUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <optgroup label="Peso">
                    <option value="kg">Quilograma</option>
                    <option value="g">Grama</option>
                    <option value="mg">Miligrama</option>
                    <option value="ton">Tonelada</option>
                  </optgroup>
                  <optgroup label="Volume">
                    <option value="l">Litro</option>
                    <option value="ml">Mililitro</option>
                    <option value="cl">Centilitro</option>
                  </optgroup>
                </select>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Resultado</p>
                <p className="text-lg font-bold text-red-600">
                  {unitConverter.result || '0'} {unitConverter.toUnit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculadora de Troco */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Banknote className="h-5 w-5 mr-2 text-red-500" />
              Calculadora de Troco
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total da Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={changeCalculator.totalSale}
                onChange={(e) => handleChangeCalculation('totalSale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Pago (R$)</label>
              <input
                type="number"
                step="0.01"
                value={changeCalculator.amountPaid}
                onChange={(e) => handleChangeCalculation('amountPaid', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Troco</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {changeCalculator.change || '0,00'}
                </p>
                {parseFloat(changeCalculator.change || '0') < 0 && (
                  <p className="text-xs text-red-500 mt-1">Valor insuficiente!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ferramentas Avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculadora de Frete/Delivery */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-red-500" />
              Calculadora de Frete/Delivery
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distância (Km)</label>
              <input
                type="number"
                step="0.1"
                value={deliveryCalculator.distance}
                onChange={(e) => handleDeliveryCalculation('distance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taxa Base (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={deliveryCalculator.baseRate}
                  onChange={(e) => handleDeliveryCalculation('baseRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="5,00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Por Km (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={deliveryCalculator.perKmRate}
                  onChange={(e) => handleDeliveryCalculation('perKmRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="2,00"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Valor do Frete</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {deliveryCalculator.totalDelivery || '0,00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controle de Perdas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-red-500" />
              Controle de Perdas
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
              <input
                type="text"
                value={lossTracker.productName}
                onChange={(e) => setLossTracker({...lossTracker, productName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Nome do produto"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                <input
                  type="number"
                  value={lossTracker.quantity}
                  onChange={(e) => setLossTracker({...lossTracker, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
                <select
                  value={lossTracker.reason}
                  onChange={(e) => setLossTracker({...lossTracker, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="vencido">Vencido</option>
                  <option value="danificado">Danificado</option>
                  <option value="quebrado">Quebrado</option>
                  <option value="furto">Furto</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Perda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={lossTracker.value}
                onChange={(e) => setLossTracker({...lossTracker, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
            
            <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
              Registrar Perda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessTools
