import React, { createContext, useContext, useState, useEffect } from 'react'

// Tipos de dados
export interface Product {
  id: number
  name: string
  barcode: string
  price: number
  cost: number
  stock: number
  category: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Sale {
  id: number
  customer_id?: number
  customer_name?: string
  total_amount: number
  discount?: number
  payment_method: 'cash' | 'card' | 'pix'
  amount_paid?: number
  change?: number
  items: SaleItem[]
  created_at: string
  updated_at: string
}

// Mock data para demonstração (será substituído por SQLite real)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Coca-Cola 2L',
    barcode: '7894900011517',
    price: 8.99,
    cost: 6.50,
    stock: 50,
    category: 'Bebidas',
    description: 'Refrigerante de cola 2 litros',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Pão de Açúcar',
    barcode: '7891000100103',
    price: 5.50,
    cost: 3.80,
    stock: 100,
    category: 'Padaria',
    description: 'Pão de açúcar 500g',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Arroz Tio João 5kg',
    barcode: '7896036098516',
    price: 22.90,
    cost: 18.50,
    stock: 30,
    category: 'Grãos',
    description: 'Arroz branco tipo 1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Leite Integral 1L',
    barcode: '7891000100111',
    price: 4.50,
    cost: 3.20,
    stock: 75,
    category: 'Lácteos',
    description: 'Leite integral longa vida',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Açúcar Cristal 1kg',
    barcode: '7891000100222',
    price: 3.99,
    cost: 2.80,
    stock: 20,
    category: 'Grãos',
    description: 'Açúcar cristal refinado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Óleo de Soja 900ml',
    barcode: '7891000100333',
    price: 6.80,
    cost: 5.20,
    stock: 0,
    category: 'Óleos',
    description: 'Óleo de soja refinado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 88888-8888',
    address: 'Av. Principal, 456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    phone: '(11) 77777-7777',
    address: 'Rua da Paz, 789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 66666-6666',
    address: 'Av. Liberdade, 101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockSales: Sale[] = [
  {
    id: 1,
    customer_id: 1,
    customer_name: 'João Silva',
    total_amount: 17.48,
    discount: 0.50,
    payment_method: 'cash',
    amount_paid: 20.00,
    change: 2.52,
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: 'Coca-Cola 2L',
        quantity: 2,
        unit_price: 8.99,
        total_price: 17.98
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    customer_id: 2,
    customer_name: 'Maria Santos',
    total_amount: 32.89,
    discount: 0.00,
    payment_method: 'card',
    amount_paid: 32.89,
    change: 0.00,
    items: [
      {
        id: 2,
        product_id: 3,
        product_name: 'Arroz Tio João 5kg',
        quantity: 1,
        unit_price: 22.90,
        total_price: 22.90
      },
      {
        id: 3,
        product_id: 1,
        product_name: 'Coca-Cola 2L',
        quantity: 1,
        unit_price: 8.99,
        total_price: 8.99
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    customer_id: 3,
    customer_name: 'Pedro Oliveira',
    total_amount: 18.99,
    discount: 1.00,
    payment_method: 'pix',
    amount_paid: 18.99,
    change: 0.00,
    items: [
      {
        id: 4,
        product_id: 2,
        product_name: 'Pão de Açúcar',
        quantity: 2,
        unit_price: 5.50,
        total_price: 11.00
      },
      {
        id: 5,
        product_id: 1,
        product_name: 'Coca-Cola 2L',
        quantity: 1,
        unit_price: 8.99,
        total_price: 8.99
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    customer_id: 4,
    customer_name: 'Ana Costa',
    total_amount: 12.49,
    discount: 0.00,
    payment_method: 'cash',
    amount_paid: 15.00,
    change: 2.51,
    items: [
      {
        id: 6,
        product_id: 4,
        product_name: 'Leite Integral 1L',
        quantity: 2,
        unit_price: 4.50,
        total_price: 9.00
      },
      {
        id: 7,
        product_id: 5,
        product_name: 'Açúcar Cristal 1kg',
        quantity: 1,
        unit_price: 3.99,
        total_price: 3.99
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    customer_id: 1,
    customer_name: 'João Silva',
    total_amount: 27.40,
    discount: 0.50,
    payment_method: 'card',
    amount_paid: 27.40,
    change: 0.00,
    items: [
      {
        id: 8,
        product_id: 3,
        product_name: 'Arroz Tio João 5kg',
        quantity: 1,
        unit_price: 22.90,
        total_price: 22.90
      },
      {
        id: 9,
        product_id: 2,
        product_name: 'Pão de Açúcar',
        quantity: 1,
        unit_price: 5.50,
        total_price: 5.50
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Context
interface DatabaseContextType {
  products: Product[]
  customers: Customer[]
  sales: Sale[]
  
  // Produtos
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: number) => Promise<void>
  getProductByBarcode: (barcode: string) => Promise<Product | null>
  
  // Clientes
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<Customer>
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: number) => Promise<void>
  
  // Vendas
  addSale: (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => Promise<Sale>
  getSalesByDateRange: (startDate: string, endDate: string) => Promise<Sale[]>
  
  // Utilitários
  refreshData: () => Promise<void>
  exportData: () => string
  importData: (data: string) => Promise<void>
  clearAllData: () => Promise<void>
  getStorageInfo: () => { products: number, customers: number, sales: number, totalSize: string }
}

const DatabaseContext = createContext<DatabaseContextType | null>(null)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Carregar dados do localStorage ou usar dados mock
  const loadFromStorage = <T,>(key: string, defaultData: T[]): T[] => {
    try {
      const stored = localStorage.getItem(`pdv_${key}`)
      return stored ? JSON.parse(stored) : defaultData
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error)
      return defaultData
    }
  }

  // Salvar dados no localStorage
  const saveToStorage = <T,>(key: string, data: T[]) => {
    try {
      localStorage.setItem(`pdv_${key}`, JSON.stringify(data))
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }

  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', mockProducts))
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('customers', mockCustomers))
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage('sales', mockSales))

  // Salvar automaticamente quando os dados mudarem
  useEffect(() => {
    saveToStorage('products', products)
  }, [products])

  useEffect(() => {
    saveToStorage('customers', customers)
  }, [customers])

  useEffect(() => {
    saveToStorage('sales', sales)
  }, [sales])

  // Produtos
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
    const updatedProduct = { ...productData, id, updated_at: new Date().toISOString() } as Product
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p))
    return updatedProduct
  }

  const deleteProduct = async (id: number): Promise<void> => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    return products.find(p => p.barcode === barcode) || null
  }

  // Clientes
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setCustomers(prev => [...prev, newCustomer])
    return newCustomer
  }

  const updateCustomer = async (id: number, customerData: Partial<Customer>): Promise<Customer> => {
    const updatedCustomer = { ...customerData, id, updated_at: new Date().toISOString() } as Customer
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedCustomer } : c))
    return updatedCustomer
  }

  const deleteCustomer = async (id: number): Promise<void> => {
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  // Vendas
  const addSale = async (saleData: Omit<Sale, 'id' | 'created_at' | 'updated_at'>): Promise<Sale> => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setSales(prev => [...prev, newSale])
    
    // Atualizar estoque dos produtos
    for (const item of saleData.items) {
      await updateProduct(item.product_id, {
        stock: products.find(p => p.id === item.product_id)!.stock - item.quantity
      })
    }
    
    return newSale
  }

  const getSalesByDateRange = async (startDate: string, endDate: string): Promise<Sale[]> => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at)
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate)
    })
  }

  const refreshData = async (): Promise<void> => {
    // Recarregar dados do localStorage
    setProducts(loadFromStorage('products', mockProducts))
    setCustomers(loadFromStorage('customers', mockCustomers))
    setSales(loadFromStorage('sales', mockSales))
    console.log('Dados recarregados do localStorage')
  }

  const exportData = (): string => {
    const data = {
      products,
      customers,
      sales,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = async (jsonData: string): Promise<void> => {
    try {
      const data = JSON.parse(jsonData)
      if (data.products) setProducts(data.products)
      if (data.customers) setCustomers(data.customers)
      if (data.sales) setSales(data.sales)
    } catch (error) {
      throw new Error('Formato de dados inválido')
    }
  }

  const clearAllData = async (): Promise<void> => {
    localStorage.removeItem('pdv_products')
    localStorage.removeItem('pdv_customers')
    localStorage.removeItem('pdv_sales')
    setProducts([])
    setCustomers([])
    setSales([])
  }

  const getStorageInfo = () => {
    const calculateSize = (data: any) => {
      return new Blob([JSON.stringify(data)]).size
    }
    
    const productsSize = calculateSize(products)
    const customersSize = calculateSize(customers)
    const salesSize = calculateSize(sales)
    const totalSize = productsSize + customersSize + salesSize
    
    return {
      products: products.length,
      customers: customers.length,
      sales: sales.length,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`
    }
  }

  const value: DatabaseContextType = {
    products,
    customers,
    sales,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByBarcode,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSale,
    getSalesByDateRange,
    refreshData,
    exportData,
    importData,
    clearAllData,
    getStorageInfo
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}
