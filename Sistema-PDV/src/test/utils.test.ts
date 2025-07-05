import { describe, it, expect } from 'vitest'

// Funções auxiliares para teste
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR')
}

export const calculateDiscount = (
  subtotal: number,
  discountType: 'percent' | 'value',
  discountAmount: number
): number => {
  if (discountType === 'percent') {
    return (subtotal * discountAmount) / 100
  }
  return discountAmount
}

export const validateBarcode = (barcode: string): boolean => {
  return barcode.trim().length >= 3
}

export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price)
}

export const calculateChange = (amountPaid: number, total: number): number => {
  return amountPaid - total
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('deve formatar valores corretamente', () => {
      expect(formatCurrency(10.99)).toBe('R$\u00A010,99') // \u00A0 é espaço não-quebrável
      expect(formatCurrency(0)).toBe('R$\u00A00,00')
      expect(formatCurrency(1000.50)).toBe('R$\u00A01.000,50')
    })

    it('deve lidar com números negativos', () => {
      expect(formatCurrency(-10.99)).toBe('-R$\u00A010,99')
    })
  })

  describe('formatDate', () => {
    it('deve formatar datas ISO corretamente', () => {
      const isoDate = '2025-07-02T10:00:00.000Z'
      const formatted = formatDate(isoDate)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('calculateDiscount', () => {
    it('deve calcular desconto percentual corretamente', () => {
      const result = calculateDiscount(100, 'percent', 10)
      expect(result).toBe(10)
    })

    it('deve calcular desconto em valor corretamente', () => {
      const result = calculateDiscount(100, 'value', 15)
      expect(result).toBe(15)
    })

    it('deve lidar com desconto 0', () => {
      expect(calculateDiscount(100, 'percent', 0)).toBe(0)
      expect(calculateDiscount(100, 'value', 0)).toBe(0)
    })
  })

  describe('validateBarcode', () => {
    it('deve validar códigos de barras válidos', () => {
      expect(validateBarcode('123')).toBe(true)
      expect(validateBarcode('7894900011517')).toBe(true)
      expect(validateBarcode('   123   ')).toBe(true) // Com espaços
    })

    it('deve invalidar códigos muito curtos', () => {
      expect(validateBarcode('')).toBe(false)
      expect(validateBarcode('12')).toBe(false)
      expect(validateBarcode('   ')).toBe(false) // Só espaços
    })
  })

  describe('validatePrice', () => {
    it('deve validar preços válidos', () => {
      expect(validatePrice(10.99)).toBe(true)
      expect(validatePrice(0.01)).toBe(true)
      expect(validatePrice(1000)).toBe(true)
    })

    it('deve invalidar preços inválidos', () => {
      expect(validatePrice(0)).toBe(false)
      expect(validatePrice(-10)).toBe(false)
      expect(validatePrice(NaN)).toBe(false)
    })
  })

  describe('calculateChange', () => {
    it('deve calcular troco corretamente', () => {
      expect(calculateChange(20, 15.50)).toBe(4.50)
      expect(calculateChange(10, 10)).toBe(0)
    })

    it('deve calcular valores negativos quando insuficiente', () => {
      expect(calculateChange(10, 15)).toBe(-5)
    })
  })
})
