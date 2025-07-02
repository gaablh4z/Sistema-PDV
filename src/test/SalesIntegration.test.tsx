import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Sales from '../pages/Sales'
import { DatabaseProvider } from '../contexts/DatabaseContext'
import { ReactNode } from 'react'

// Wrapper com providers necessários
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <DatabaseProvider>
      {children}
    </DatabaseProvider>
  </BrowserRouter>
)

describe('Sales Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock do window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('deve completar um fluxo de venda completo', async () => {
    render(<Sales />, { wrapper: TestWrapper })

    // 1. Adicionar primeiro produto (Coca-Cola 2L)
    const barcodeInput = screen.getByPlaceholderText('Digite ou escaneie o código de barras...')
    await user.type(barcodeInput, '7894900011517')
    
    const form = barcodeInput.closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
    })

    // 2. Aumentar quantidade para 2 (botão Plus)
    const plusButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.className.includes('text-gray-400')
    )
    await user.click(plusButtons[1])

    expect(screen.getByDisplayValue('2')).toBeInTheDocument()

    // 3. Adicionar segundo produto (Pão de Açúcar)
    await user.clear(barcodeInput)
    await user.type(barcodeInput, '7891000100103')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument()
    })

    // 4. Aplicar desconto de 10%
    fireEvent.keyDown(document, { key: 'F2', code: 'F2' })

    await waitFor(() => {
      expect(screen.getByText('Aplicar Desconto')).toBeInTheDocument()
    })

    const discountInput = screen.getByPlaceholderText('0')
    await user.type(discountInput, '10')

    const applyDiscountButton = screen.getByText('Aplicar Desconto')
    await user.click(applyDiscountButton)

    // 5. Finalizar venda
    fireEvent.keyDown(document, { key: 'F12', code: 'F12' })

    await waitFor(() => {
      expect(screen.getByText('Finalizar Venda')).toBeInTheDocument()
    })

    // 6. Selecionar forma de pagamento (Dinheiro)
    const cashButton = screen.getByText('Dinheiro')
    await user.click(cashButton)

    // 7. Inserir valor pago
    const amountInput = screen.getByPlaceholderText('0,00')
    await user.type(amountInput, '30')

    // 8. Confirmar venda
    const confirmButton = await screen.findByRole('button', { name: /confirmar venda/i })
    await user.click(confirmButton)

    // 9. Verificar se aparece o recibo
    await waitFor(() => {
      expect(screen.getByText('Venda Realizada com Sucesso!')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deve lidar com produto sem estoque', async () => {
    render(<Sales />, { wrapper: TestWrapper })

    // Tentar adicionar produto sem estoque (Óleo de Soja)
    const barcodeInput = screen.getByPlaceholderText('Digite ou escaneie o código de barras...')
    await user.type(barcodeInput, '7891000100333')
    
    const form = barcodeInput.closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('⚠️ Produto sem estoque disponível! Verifique o estoque antes de continuar.')
    })
  })

  it('deve calcular totais corretamente com múltiplos produtos e desconto', async () => {
    render(<Sales />, { wrapper: TestWrapper })

    // Adicionar Coca-Cola 2L (R$ 8,99)
    const barcodeInput = screen.getByPlaceholderText('Digite ou escaneie o código de barras...')
    await user.type(barcodeInput, '7894900011517')
    fireEvent.submit(barcodeInput.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
    })

    // Adicionar Pão de Açúcar (R$ 5,50)
    await user.clear(barcodeInput)
    await user.type(barcodeInput, '7891000100103')
    fireEvent.submit(barcodeInput.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument()
    })

    // Verificar subtotal (8,99 + 5,50 = 14,49) - pode estar dividido em elementos
    await waitFor(() => {
      expect(screen.getByText((_, element) => {
        return (element?.textContent?.includes('14,49') || element?.textContent?.includes('14.49')) ?? false
      })).toBeInTheDocument()
    })

    // Aplicar desconto de R$ 2,00
    fireEvent.keyDown(document, { key: 'F2', code: 'F2' })

    await waitFor(() => {
      expect(screen.getByText('Aplicar Desconto')).toBeInTheDocument()
    })

    // Mudar para desconto em valor
    const valueRadio = screen.getByLabelText('Valor (R$)')
    await user.click(valueRadio)

    const discountInput = screen.getByPlaceholderText('0')
    await user.type(discountInput, '2')

    const applyButton = screen.getByText('Aplicar Desconto')
    await user.click(applyButton)

    // Verificar total com desconto (14,49 - 2,00 = 12,49)
    await waitFor(() => {
      expect(screen.getByText((_, element) => {
        return (element?.textContent?.includes('12,49') || element?.textContent?.includes('12.49')) ?? false
      })).toBeInTheDocument()
    })
  })

  it('deve impedir venda com valor insuficiente', async () => {
    render(<Sales />, { wrapper: TestWrapper })

    // Adicionar produto
    const barcodeInput = screen.getByPlaceholderText('Digite ou escaneie o código de barras...')
    await user.type(barcodeInput, '7894900011517') // R$ 8,99
    fireEvent.submit(barcodeInput.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
    })

    // Tentar finalizar com valor insuficiente
    fireEvent.keyDown(document, { key: 'F12', code: 'F12' })

    await waitFor(() => {
      expect(screen.getByText((_, element) => {
        return element?.textContent?.includes('Finalizar Venda') ?? false
      })).toBeInTheDocument()
    })

    // Inserir valor menor que o total
    const amountInput = screen.getByPlaceholderText('0,00')
    await user.type(amountInput, '5') // Menor que R$ 8,99

    const confirmButton = await screen.findByRole('button', { name: /confirmar venda/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('💵 Valor pago insuficiente! Faltam R$ 3.99')
    })
  })

  it('deve limpar carrinho após venda bem-sucedida', async () => {
    render(<Sales />, { wrapper: TestWrapper })

    // Adicionar produto
    const barcodeInput = screen.getByPlaceholderText('Digite ou escaneie o código de barras...')
    await user.type(barcodeInput, '7894900011517')
    fireEvent.submit(barcodeInput.closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
    })

    // Finalizar venda
    fireEvent.keyDown(document, { key: 'F12', code: 'F12' })

    await waitFor(() => {
      expect(screen.getByText((_, element) => {
        return element?.textContent?.includes('Finalizar Venda') ?? false
      })).toBeInTheDocument()
    })

    const amountInput = screen.getByPlaceholderText('0,00')
    await user.type(amountInput, '10')

    const confirmButton = await screen.findByRole('button', { name: /confirmar venda/i })
    await user.click(confirmButton)

    // Aguardar processamento da venda
    await waitFor(() => {
      expect(screen.getByText('Venda Realizada com Sucesso!')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Fechar recibo
    const closeButton = screen.getByText('Fechar')
    await user.click(closeButton)

    // Verificar se carrinho foi limpo
    await waitFor(() => {
      expect(screen.queryByText('Coca-Cola 2L')).not.toBeInTheDocument()
      expect(screen.getByText((_, element) => {
        return (element?.textContent?.includes('0,00') && element?.textContent?.includes('R$')) ?? false
      })).toBeInTheDocument() // Subtotal zerado
    })
  })
})
