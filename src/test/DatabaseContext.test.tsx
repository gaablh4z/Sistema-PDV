import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DatabaseProvider, useDatabase } from '../contexts/DatabaseContext'
import { ReactNode } from 'react'

// Wrapper do provider para os testes
const wrapper = ({ children }: { children: ReactNode }) => (
  <DatabaseProvider>{children}</DatabaseProvider>
)

describe('DatabaseContext', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Produtos', () => {
    it('deve carregar produtos iniciais', () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      expect(result.current.products).toBeDefined()
      expect(result.current.products.length).toBeGreaterThan(0)
    })

    it('deve adicionar um novo produto', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const newProduct = {
        name: 'Produto Teste',
        barcode: '12345',
        price: 10.99,
        cost: 8.50,
        stock: 100,
        category: 'Teste',
        description: 'Produto para teste'
      }

      await act(async () => {
        await result.current.addProduct(newProduct)
      })

      const addedProduct = result.current.products.find(p => p.name === 'Produto Teste')
      expect(addedProduct).toBeDefined()
      expect(addedProduct?.price).toBe(10.99)
      expect(addedProduct?.stock).toBe(100)
    })

    it('deve atualizar um produto existente', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      // Primeiro produto da lista mock
      const firstProduct = result.current.products[0]
      const updatedData = {
        ...firstProduct,
        name: 'Produto Atualizado',
        price: 15.99
      }

      await act(async () => {
        await result.current.updateProduct(firstProduct.id, updatedData)
      })

      const updatedProduct = result.current.products.find(p => p.id === firstProduct.id)
      expect(updatedProduct?.name).toBe('Produto Atualizado')
      expect(updatedProduct?.price).toBe(15.99)
    })

    it('deve deletar um produto', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const initialCount = result.current.products.length
      const firstProduct = result.current.products[0]

      await act(async () => {
        await result.current.deleteProduct(firstProduct.id)
      })

      expect(result.current.products.length).toBe(initialCount - 1)
      expect(result.current.products.find(p => p.id === firstProduct.id)).toBeUndefined()
    })

    it('deve buscar produto por código de barras', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      // Produto com código de barras conhecido
      const product = await result.current.getProductByBarcode('7894900011517')
      
      expect(product).toBeDefined()
      expect(product?.name).toBe('Coca-Cola 2L')
    })

    it('deve retornar null para código de barras inexistente', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const product = await result.current.getProductByBarcode('99999999999')
      
      expect(product).toBeNull()
    })
  })

  describe('Clientes', () => {
    it('deve carregar clientes iniciais', () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      expect(result.current.customers).toBeDefined()
      expect(result.current.customers.length).toBeGreaterThan(0)
    })

    it('deve adicionar um novo cliente', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const newCustomer = {
        name: 'Cliente Teste',
        email: 'teste@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua Teste, 123'
      }

      await act(async () => {
        await result.current.addCustomer(newCustomer)
      })

      const addedCustomer = result.current.customers.find(c => c.name === 'Cliente Teste')
      expect(addedCustomer).toBeDefined()
      expect(addedCustomer?.email).toBe('teste@email.com')
    })
  })

  describe('Vendas', () => {
    it('deve carregar vendas iniciais', () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      expect(result.current.sales).toBeDefined()
      expect(result.current.sales.length).toBeGreaterThan(0)
    })

    it('deve adicionar uma nova venda', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const newSale = {
        customer_id: 1,
        customer_name: 'João Silva',
        total_amount: 25.98,
        discount: 1.00,
        payment_method: 'cash' as const,
        amount_paid: 30.00,
        change: 5.02,
        items: [{
          id: 1,
          product_id: 1,
          product_name: 'Coca-Cola 2L',
          quantity: 2,
          unit_price: 8.99,
          total_price: 17.98
        }]
      }

      await act(async () => {
        await result.current.addSale(newSale)
      })

      const addedSale = result.current.sales.find(s => s.total_amount === 25.98)
      expect(addedSale).toBeDefined()
      expect(addedSale?.payment_method).toBe('cash')
      expect(addedSale?.items.length).toBe(1)
    })

    it('deve filtrar vendas por período', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const today = new Date().toISOString().split('T')[0]
      const filteredSales = await result.current.getSalesByDateRange(today, today)
      
      // Verificar se é um array
      expect(Array.isArray(filteredSales)).toBe(true)
    })
  })

  describe('Armazenamento', () => {
    it('deve obter informações de armazenamento', () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const info = result.current.getStorageInfo()
      
      expect(info).toHaveProperty('products')
      expect(info).toHaveProperty('customers')
      expect(info).toHaveProperty('sales')
      expect(info).toHaveProperty('totalSize')
      expect(typeof info.totalSize).toBe('string')
    })

    it('deve exportar dados', () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const exportedData = result.current.exportData()
      
      expect(typeof exportedData).toBe('string')
      expect(() => JSON.parse(exportedData)).not.toThrow()
      
      const parsed = JSON.parse(exportedData)
      expect(parsed).toHaveProperty('products')
      expect(parsed).toHaveProperty('customers')
      expect(parsed).toHaveProperty('sales')
      expect(parsed).toHaveProperty('exportDate')
      expect(parsed).toHaveProperty('version')
    })

    it('deve importar dados válidos', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const validData = JSON.stringify({
        products: [],
        customers: [],
        sales: []
      })

      await act(async () => {
        await result.current.importData(validData)
      })

      // Se chegou até aqui sem erro, o import foi bem sucedido
      expect(true).toBe(true)
    })

    it('deve rejeitar dados inválidos na importação', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      const invalidData = 'dados inválidos'

      await expect(async () => {
        await act(async () => {
          await result.current.importData(invalidData)
        })
      }).rejects.toThrow()
    })

    it('deve limpar todos os dados', async () => {
      const { result } = renderHook(() => useDatabase(), { wrapper })
      
      await act(async () => {
        await result.current.clearAllData()
      })

      expect(result.current.products.length).toBe(0)
      expect(result.current.customers.length).toBe(0)
      expect(result.current.sales.length).toBe(0)
    })
  })
})
