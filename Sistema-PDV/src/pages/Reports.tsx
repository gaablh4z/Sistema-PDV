import React, { useState } from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import * as XLSX from 'xlsx'

const Reports: React.FC = () => {
  const { sales, products, customers } = useDatabase()
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [reportType, setReportType] = useState<'sales' | 'products' | 'customers'>('sales')
  const [isExporting, setIsExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Função utilitária para formatar dados Excel
  const formatExcelSheet = (data: any[][], _sheetName?: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet(data)
    
    // Definir largura das colunas
    const colWidths = data[0]?.map((_, colIndex) => {
      const maxLength = Math.max(
        ...data.map(row => String(row[colIndex] || '').length)
      )
      return { wch: Math.max(maxLength + 2, 10) }
    }) || []
    
    worksheet['!cols'] = colWidths
    
    return worksheet
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setExportMessage({ type, text })
    setTimeout(() => setExportMessage(null), 4000)
  }

  // Função para resetar filtros
  const resetFilters = () => {
    const today = new Date().toISOString().split('T')[0]
    setDateRange({ start: today, end: today })
    setReportType('sales')
  }

  // Filtrar vendas por período
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0]
    return saleDate >= dateRange.start && saleDate <= dateRange.end
  })

  // Calcular métricas
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0)
  const totalTransactions = filteredSales.length
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

  // Vendas por forma de pagamento
  const paymentMethodStats = filteredSales.reduce((acc, sale) => {
    acc[sale.payment_method] = (acc[sale.payment_method] || 0) + sale.total_amount
    return acc
  }, {} as Record<string, number>)

  // Produtos mais vendidos
  const productSales = filteredSales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.product_name]) {
        acc[item.product_name] = { quantity: 0, revenue: 0 }
      }
      acc[item.product_name].quantity += item.quantity
      acc[item.product_name].revenue += item.total_price
    })
    return acc
  }, {} as Record<string, { quantity: number; revenue: number }>)

  // Exportar Relatório de Vendas para Excel
  const exportSalesReport = () => {
    setIsExporting(true)
    try {
      const workbook = XLSX.utils.book_new()

      // Aba 1: Resumo Geral
      const summaryData = [
        ['RELATÓRIO DE VENDAS - MERCADO BETEL'],
        [''],
        ['Período:', `${new Date(dateRange.start).toLocaleDateString('pt-BR')} até ${new Date(dateRange.end).toLocaleDateString('pt-BR')}`],
        ['Gerado em:', new Date().toLocaleString('pt-BR')],
        [''],
        ['RESUMO GERAL'],
        ['Total de Vendas', totalTransactions.toString()],
        ['Receita Total', `R$ ${totalRevenue.toFixed(2)}`],
        ['Ticket Médio', `R$ ${averageTicket.toFixed(2)}`],
        [''],
        ['VENDAS POR FORMA DE PAGAMENTO'],
        ['Dinheiro', `R$ ${(paymentMethodStats.cash || 0).toFixed(2)}`],
        ['Cartão', `R$ ${(paymentMethodStats.card || 0).toFixed(2)}`],
        ['PIX', `R$ ${(paymentMethodStats.pix || 0).toFixed(2)}`]
      ]
      
      const summarySheet = formatExcelSheet(summaryData, 'Resumo')
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')

      // Aba 2: Vendas Detalhadas
      const salesDetailData = [
        ['Data', 'Cliente', 'Total', 'Desconto', 'Pagamento', 'Valor Pago', 'Troco', 'Itens']
      ]
      
      filteredSales.forEach(sale => {
        const itemsText = sale.items.map(item => `${item.product_name} (${item.quantity}x)`).join(', ')
        salesDetailData.push([
          new Date(sale.created_at).toLocaleString('pt-BR'),
          sale.customer_name || 'Cliente Avulso',
          `R$ ${sale.total_amount.toFixed(2)}`,
          `R$ ${(sale.discount || 0).toFixed(2)}`,
          sale.payment_method === 'cash' ? 'Dinheiro' : sale.payment_method === 'card' ? 'Cartão' : 'PIX',
          `R$ ${(sale.amount_paid || sale.total_amount).toFixed(2)}`,
          `R$ ${(sale.change || 0).toFixed(2)}`,
          itemsText
        ])
      })

      const salesSheet = formatExcelSheet(salesDetailData, 'Vendas Detalhadas')
      XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas Detalhadas')

      // Aba 3: Produtos Vendidos
      const productsData = [['Produto', 'Quantidade Vendida', 'Receita Total']]
      Object.entries(productSales)
        .sort(([,a], [,b]) => b.revenue - a.revenue)
        .forEach(([product, data]) => {
          productsData.push([product, data.quantity.toString(), `R$ ${data.revenue.toFixed(2)}`])
        })

      const productsSheet = formatExcelSheet(productsData, 'Produtos Vendidos')
      XLSX.utils.book_append_sheet(workbook, productsSheet, 'Produtos Vendidos')

      // Salvar arquivo
      const fileName = `relatorio-vendas-${dateRange.start}-${dateRange.end}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      showMessage('success', 'Relatório de vendas exportado com sucesso!')
    } catch (error) {
      showMessage('error', 'Erro ao exportar relatório de vendas')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  // Exportar Relatório de Produtos para Excel
  const exportProductsReport = () => {
    setIsExporting(true)
    try {
      const workbook = XLSX.utils.book_new()

      // Aba 1: Produtos Cadastrados
      const productsData = [
        ['Código', 'Nome', 'Código de Barras', 'Preço', 'Custo', 'Estoque', 'Categoria', 'Margem %']
      ]
      
      products.forEach(product => {
        const margin = ((product.price - product.cost) / product.cost * 100).toFixed(2)
        productsData.push([
          product.id.toString(),
          product.name,
          product.barcode,
          `R$ ${product.price.toFixed(2)}`,
          `R$ ${product.cost.toFixed(2)}`,
          product.stock.toString(),
          product.category,
          `${margin}%`
        ])
      })

      const productsSheet = formatExcelSheet(productsData, 'Produtos')
      XLSX.utils.book_append_sheet(workbook, productsSheet, 'Produtos')

      // Aba 2: Análise de Estoque
      const stockData = [['Produto', 'Estoque Atual', 'Status', 'Valor em Estoque']]
      products.forEach(product => {
        const status = product.stock === 0 ? 'SEM ESTOQUE' : 
                     product.stock <= 5 ? 'ESTOQUE BAIXO' : 'OK'
        const stockValue = product.stock * product.cost
        
        stockData.push([
          product.name,
          product.stock.toString(),
          status,
          `R$ ${stockValue.toFixed(2)}`
        ])
      })

      const stockSheet = formatExcelSheet(stockData, 'Análise de Estoque')
      XLSX.utils.book_append_sheet(workbook, stockSheet, 'Análise de Estoque')

      // Aba 3: Resumo por Categoria
      const categoryData = [['Categoria', 'Qtd Produtos', 'Valor Total Estoque', 'Margem Média %']]
      const categories = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = { count: 0, stockValue: 0, totalMargin: 0 }
        }
        acc[product.category].count++
        acc[product.category].stockValue += product.stock * product.cost
        acc[product.category].totalMargin += (product.price - product.cost) / product.cost * 100
        return acc
      }, {} as Record<string, { count: number; stockValue: number; totalMargin: number }>)

      Object.entries(categories).forEach(([category, data]) => {
        const avgMargin = (data.totalMargin / data.count).toFixed(2)
        categoryData.push([category, data.count.toString(), `R$ ${data.stockValue.toFixed(2)}`, `${avgMargin}%`])
      })

      const categorySheet = formatExcelSheet(categoryData, 'Por Categoria')
      XLSX.utils.book_append_sheet(workbook, categorySheet, 'Por Categoria')

      const fileName = `relatorio-produtos-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      showMessage('success', 'Relatório de produtos exportado com sucesso!')
    } catch (error) {
      showMessage('error', 'Erro ao exportar relatório de produtos')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  // Exportar Relatório de Clientes para Excel  
  const exportCustomersReport = () => {
    setIsExporting(true)
    try {
      const workbook = XLSX.utils.book_new()

      // Aba 1: Clientes Cadastrados
      const customersData = [
        ['Código', 'Nome', 'Email', 'Telefone', 'Endereço', 'Data Cadastro']
      ]
      
      customers.forEach(customer => {
        customersData.push([
          customer.id.toString(),
          customer.name,
          customer.email || '',
          customer.phone || '',
          customer.address || '',
          new Date(customer.created_at).toLocaleDateString('pt-BR')
        ])
      })

      const customersSheet = formatExcelSheet(customersData, 'Clientes')
      XLSX.utils.book_append_sheet(workbook, customersSheet, 'Clientes')

      // Aba 2: Histórico de Compras por Cliente
      const customerSalesData = [
        ['Cliente', 'Total de Compras', 'Valor Total', 'Última Compra', 'Ticket Médio']
      ]
      
      const customerStats = customers.map(customer => {
        const customerSales = sales.filter(sale => sale.customer_id === customer.id)
        const totalPurchases = customerSales.length
        const totalValue = customerSales.reduce((sum, sale) => sum + sale.total_amount, 0)
        const lastPurchase = customerSales.length > 0 ? 
          new Date(Math.max(...customerSales.map(sale => new Date(sale.created_at).getTime()))).toLocaleDateString('pt-BR') : 
          'Nunca'
        const avgTicket = totalPurchases > 0 ? totalValue / totalPurchases : 0

        return {
          name: customer.name,
          totalPurchases,
          totalValue,
          lastPurchase,
          avgTicket
        }
      })

      customerStats.forEach(stat => {
        customerSalesData.push([
          stat.name,
          stat.totalPurchases.toString(),
          `R$ ${stat.totalValue.toFixed(2)}`,
          stat.lastPurchase,
          `R$ ${stat.avgTicket.toFixed(2)}`
        ])
      })

      const customerSalesSheet = formatExcelSheet(customerSalesData, 'Histórico de Compras')
      XLSX.utils.book_append_sheet(workbook, customerSalesSheet, 'Histórico de Compras')

      const fileName = `relatorio-clientes-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      showMessage('success', 'Relatório de clientes exportado com sucesso!')
    } catch (error) {
      showMessage('error', 'Erro ao exportar relatório de clientes')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  // Exportar Relatório Completo
  const exportCompleteReport = () => {
    setIsExporting(true)
    try {
      const workbook = XLSX.utils.book_new()

      // 1. Resumo Executivo
      const executiveData = [
        ['RELATÓRIO EXECUTIVO COMPLETO - MERCADO BETEL'],
        [''],
        ['Gerado em:', new Date().toLocaleString('pt-BR')],
        ['Período de Análise:', `${new Date(dateRange.start).toLocaleDateString('pt-BR')} até ${new Date(dateRange.end).toLocaleDateString('pt-BR')}`],
        [''],
        ['RESUMO GERAL DO NEGÓCIO'],
        ['Total de Produtos Cadastrados', products.length],
        ['Total de Clientes Cadastrados', customers.length],
        ['Total de Vendas no Período', totalTransactions],
        ['Receita Total no Período', `R$ ${totalRevenue.toFixed(2)}`],
        ['Ticket Médio', `R$ ${averageTicket.toFixed(2)}`],
        [''],
        ['INDICADORES DE ESTOQUE'],
        ['Produtos em Estoque', products.filter(p => p.stock > 0).length],
        ['Produtos com Estoque Baixo (≤5)', products.filter(p => p.stock <= 5 && p.stock > 0).length],
        ['Produtos sem Estoque', products.filter(p => p.stock === 0).length],
        ['Valor Total Investido em Estoque', `R$ ${products.reduce((sum, p) => sum + (p.stock * p.cost), 0).toFixed(2)}`],
        [''],
        ['FORMAS DE PAGAMENTO MAIS UTILIZADAS'],
        ...Object.entries(paymentMethodStats).map(([method, amount]) => [
          method === 'cash' ? 'Dinheiro' : method === 'card' ? 'Cartão' : 'PIX',
          `R$ ${amount.toFixed(2)}`
        ])
      ]

      const executiveSheet = formatExcelSheet(executiveData, 'Resumo Executivo')
      XLSX.utils.book_append_sheet(workbook, executiveSheet, 'Resumo Executivo')

      // 2. Vendas Detalhadas
      const salesDetailData = [
        ['Data/Hora', 'Cliente', 'Total', 'Desconto', 'Forma Pagamento', 'Valor Pago', 'Troco', 'Itens']
      ]
      
      filteredSales.forEach(sale => {
        const itemsText = sale.items.map(item => `${item.product_name} (${item.quantity}x R$${item.unit_price})`).join('; ')
        salesDetailData.push([
          new Date(sale.created_at).toLocaleString('pt-BR'),
          sale.customer_name || 'Cliente Avulso',
          `R$ ${sale.total_amount.toFixed(2)}`,
          `R$ ${(sale.discount || 0).toFixed(2)}`,
          sale.payment_method === 'cash' ? 'Dinheiro' : sale.payment_method === 'card' ? 'Cartão' : 'PIX',
          `R$ ${(sale.amount_paid || sale.total_amount).toFixed(2)}`,
          `R$ ${(sale.change || 0).toFixed(2)}`,
          itemsText
        ])
      })

      const salesSheet = formatExcelSheet(salesDetailData, 'Vendas Detalhadas')
      XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas Detalhadas')

      // 3. Produtos Vendidos
      const productsData = [['Produto', 'Quantidade Vendida', 'Receita Total', 'Ticket Médio por Produto']]
      Object.entries(productSales)
        .sort(([,a], [,b]) => b.revenue - a.revenue)
        .forEach(([product, data]) => {
          const avgTicket = data.revenue / data.quantity
          productsData.push([product, data.quantity.toString(), `R$ ${data.revenue.toFixed(2)}`, `R$ ${avgTicket.toFixed(2)}`])
        })

      const productsSoldSheet = formatExcelSheet(productsData, 'Produtos Vendidos')
      XLSX.utils.book_append_sheet(workbook, productsSoldSheet, 'Produtos Vendidos')

      // 4. Cadastro de Produtos Completo
      const allProductsData = [
        ['Código', 'Nome', 'Código de Barras', 'Preço Venda', 'Custo', 'Estoque', 'Categoria', 'Margem %', 'Valor Estoque']
      ]
      
      products.forEach(product => {
        const margin = ((product.price - product.cost) / product.cost * 100).toFixed(2)
        const stockValue = product.stock * product.cost
        allProductsData.push([
          product.id.toString(),
          product.name,
          product.barcode,
          `R$ ${product.price.toFixed(2)}`,
          `R$ ${product.cost.toFixed(2)}`,
          product.stock.toString(),
          product.category,
          `${margin}%`,
          `R$ ${stockValue.toFixed(2)}`
        ])
      })

      const allProductsSheet = formatExcelSheet(allProductsData, 'Cadastro Produtos')
      XLSX.utils.book_append_sheet(workbook, allProductsSheet, 'Cadastro Produtos')

      // 5. Análise de Estoque
      const stockAnalysisData = [['Produto', 'Estoque Atual', 'Status', 'Valor em Estoque', 'Categoria', 'Ação Sugerida']]
      products.forEach(product => {
        let status = 'OK'
        let action = 'Manter'
        
        if (product.stock === 0) {
          status = 'SEM ESTOQUE'
          action = 'REABASTECER URGENTE'
        } else if (product.stock <= 5) {
          status = 'ESTOQUE BAIXO'
          action = 'Reabastecer'
        } else if (product.stock > 50) {
          status = 'ESTOQUE ALTO'
          action = 'Avaliar giro'
        }
        
        const stockValue = product.stock * product.cost
        stockAnalysisData.push([
          product.name,
          product.stock.toString(),
          status,
          `R$ ${stockValue.toFixed(2)}`,
          product.category,
          action
        ])
      })

      const stockAnalysisSheet = formatExcelSheet(stockAnalysisData, 'Análise Estoque')
      XLSX.utils.book_append_sheet(workbook, stockAnalysisSheet, 'Análise Estoque')

      // 6. Clientes e Histórico
      const customersDetailData = [
        ['Código', 'Nome', 'Email', 'Telefone', 'Total Compras', 'Valor Total', 'Última Compra', 'Ticket Médio']
      ]
      
      customers.forEach(customer => {
        const customerSales = sales.filter(sale => sale.customer_id === customer.id)
        const totalPurchases = customerSales.length
        const totalValue = customerSales.reduce((sum, sale) => sum + sale.total_amount, 0)
        const lastPurchase = customerSales.length > 0 ? 
          new Date(Math.max(...customerSales.map(sale => new Date(sale.created_at).getTime()))).toLocaleDateString('pt-BR') : 
          'Nunca comprou'
        const avgTicket = totalPurchases > 0 ? (totalValue / totalPurchases).toFixed(2) : '0'

        customersDetailData.push([
          customer.id.toString(),
          customer.name,
          customer.email || 'Não informado',
          customer.phone || 'Não informado',
          totalPurchases.toString(),
          `R$ ${totalValue.toFixed(2)}`,
          lastPurchase,
          `R$ ${avgTicket}`
        ])
      })

      const customersDetailSheet = formatExcelSheet(customersDetailData, 'Clientes Detalhado')
      XLSX.utils.book_append_sheet(workbook, customersDetailSheet, 'Clientes Detalhado')

      // 7. Vendas por Dia
      const dailySalesData = [['Data', 'Vendas', 'Faturamento', 'Ticket Médio']]
      Object.entries(dailySales).forEach(([date, amount]) => {
        const dayTransactions = filteredSales.filter(sale => 
          new Date(sale.created_at).toLocaleDateString('pt-BR') === date
        ).length
        const dayAvgTicket = dayTransactions > 0 ? amount / dayTransactions : 0
        
        dailySalesData.push([date, dayTransactions.toString(), `R$ ${amount.toFixed(2)}`, `R$ ${dayAvgTicket.toFixed(2)}`])
      })

      const dailySalesSheet = formatExcelSheet(dailySalesData, 'Vendas por Dia')
      XLSX.utils.book_append_sheet(workbook, dailySalesSheet, 'Vendas por Dia')

      const fileName = `relatorio-executivo-completo-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      showMessage('success', 'Relatório executivo completo exportado com sucesso! 7 abas criadas.')
    } catch (error) {
      showMessage('error', 'Erro ao exportar relatório completo')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10)

  // Vendas por dia
  const dailySales = filteredSales.reduce((acc, sale) => {
    const date = new Date(sale.created_at).toLocaleDateString('pt-BR')
    acc[date] = (acc[date] || 0) + sale.total_amount
    return acc
  }, {} as Record<string, number>)

  const exportReport = () => {
    const data = {
      periodo: `${dateRange.start} até ${dateRange.end}`,
      resumo: {
        faturamento_total: totalRevenue,
        total_vendas: totalTransactions,
        ticket_medio: averageTicket
      },
      vendas_por_pagamento: paymentMethodStats,
      produtos_mais_vendidos: topProducts,
      vendas_por_dia: dailySales
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${reportType}_${dateRange.start}_${dateRange.end}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 text-gray-800 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center text-primary-800">
              <BarChart3 className="mr-3 text-primary-700" />
              Relatórios e Analytics
            </h2>
            <p className="text-gray-500">Análise detalhada do seu negócio</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Período Selecionado</p>
            <p className="text-xl font-bold text-primary-800">
              {new Date(dateRange.start).toLocaleDateString('pt-BR')} até {new Date(dateRange.end).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem de Status */}
      {exportMessage && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          exportMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {exportMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{exportMessage.text}</span>
        </div>
      )}

      {/* Filtros e Exportações */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filtros e Exportação</h3>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resetar Filtros</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Vendas</option>
              <option value="products">Produtos</option>
              <option value="customers">Clientes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exportar Excel</label>
            <div className="space-y-2">
              {reportType === 'sales' && (
                <button
                  onClick={exportSalesReport}
                  disabled={isExporting}
                  className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 text-sm disabled:bg-gray-300"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{isExporting ? 'Exportando...' : 'Vendas'}</span>
                </button>
              )}
              
              {reportType === 'products' && (
                <button
                  onClick={exportProductsReport}
                  disabled={isExporting}
                  className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm disabled:bg-gray-300"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{isExporting ? 'Exportando...' : 'Produtos'}</span>
                </button>
              )}
              
              {reportType === 'customers' && (
                <button
                  onClick={exportCustomersReport}
                  disabled={isExporting}
                  className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 text-sm disabled:bg-gray-300"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{isExporting ? 'Exportando...' : 'Clientes'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botão de Relatório Completo */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={exportCompleteReport}
              disabled={isExporting}
              className="bg-white text-primary-800 py-3 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 font-semibold disabled:bg-gray-100 shadow-sm border border-primary-200 hover:border-primary-300"
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span>{isExporting ? 'Gerando...' : 'Relatório Executivo Excel'}</span>
            </button>
            
            <button
              onClick={exportReport}
              disabled={isExporting}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-semibold disabled:bg-gray-300"
            >
              <Download className="h-5 w-5" />
              <span>{isExporting ? 'Exportando...' : 'Exportar Dados JSON'}</span>
            </button>
          </div>
        </div>
      </div>

      {reportType === 'sales' && (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    R$ {totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{totalTransactions}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    R$ {averageTicket.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas por Forma de Pagamento */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Vendas por Forma de Pagamento
                </h3>
              </div>
              <div className="p-6">
                {Object.entries(paymentMethodStats).map(([method, amount]) => (
                  <div key={method} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {method === 'cash' ? 'Dinheiro' : method === 'card' ? 'Cartão' : 'PIX'}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      R$ {amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                {Object.keys(paymentMethodStats).length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhuma venda no período</p>
                )}
              </div>
            </div>

            {/* Produtos Mais Vendidos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Produtos Mais Vendidos
                </h3>
              </div>
              <div className="p-6">
                {topProducts.map(([productName, stats], index) => (
                  <div key={productName} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{productName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{stats.quantity} unidades</div>
                      <div className="text-xs text-green-600">R$ {stats.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhuma venda no período</p>
                )}
              </div>
            </div>
          </div>

          {/* Vendas por Dia */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Vendas por Dia
              </h3>
            </div>
            <div className="p-6">
              {Object.entries(dailySales).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(dailySales).map(([date, amount]) => (
                    <div key={date} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-900">{date}</span>
                      <span className="text-sm font-semibold text-green-600">R$ {amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma venda no período</p>
              )}
            </div>
          </div>
        </>
      )}

      {reportType === 'products' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Relatório de Produtos
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{products.length}</div>
                <div className="text-gray-600">Total de Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </div>
                <div className="text-gray-600">Itens em Estoque</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {products.filter(p => p.stock <= 10).length}
                </div>
                <div className="text-gray-600">Estoque Baixo</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.stock <= 5 ? 'bg-red-100 text-red-800' :
                          product.stock <= 10 ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">R$ {product.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'customers' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Relatório de Clientes
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{customers.length}</div>
                <div className="text-gray-600">Total de Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {customers.filter(c => c.email).length}
                </div>
                <div className="text-gray-600">Com Email</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map(customer => (
                    <tr key={customer.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{customer.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{customer.email || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{customer.phone || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
