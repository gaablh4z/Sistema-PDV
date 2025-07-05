import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Products from '../pages/Products'
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

describe('Products Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    render(<Products />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('Novo Produto')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar por nome, código de barras ou categoria...')).toBeInTheDocument()
  })

  it('deve exibir produtos da lista', () => {
    render(<Products />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
    expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument()
    expect(screen.getByText('Arroz Tio João 5kg')).toBeInTheDocument()
  })

  it('deve filtrar produtos ao digitar na busca', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome, código de barras ou categoria...')
    await user.type(searchInput, 'Coca')
    
    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
      expect(screen.queryByText('Pão de Açúcar')).not.toBeInTheDocument()
    })
  })

  it('deve abrir modal ao clicar em Novo Produto', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    const newButton = screen.getByText('Novo Produto')
    await user.click(newButton)
    
    await waitFor(() => {
      expect(screen.getByText('Novo Produto')).toBeInTheDocument()
      expect(screen.getByLabelText(/Nome/)).toBeInTheDocument()
    })
  })

  it('deve validar campos obrigatórios ao criar produto', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Abrir modal
    const newButton = screen.getByText('Novo Produto')
    await user.click(newButton)
    
    await waitFor(() => {
      expect(screen.getByText('Criar')).toBeInTheDocument()
    })
    
    // Tentar criar sem preencher campos
    const createButton = screen.getByText('Criar')
    await user.click(createButton)
    
    // Campos obrigatórios devem estar marcados como required
    const nameInput = screen.getByLabelText(/Nome/)
    expect(nameInput).toBeRequired()
  })

  it('deve criar novo produto com dados válidos', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Abrir modal
    const newButton = screen.getByText('Novo Produto')
    await user.click(newButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Nome/)).toBeInTheDocument()
    })
    
    // Preencher formulário
    await user.type(screen.getByLabelText(/Nome/), 'Produto Teste')
    await user.type(screen.getByLabelText(/Código de Barras/), '123456789')
    await user.type(screen.getByLabelText(/Preço de Venda/), '15.99')
    await user.type(screen.getByLabelText(/Preço de Custo/), '10.50')
    await user.type(screen.getByLabelText(/Estoque/), '50')
    await user.type(screen.getByLabelText(/Categoria/), 'Teste')
    
    // Criar produto
    const createButton = screen.getByText('Criar')
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Produto Teste')).toBeInTheDocument()
    })
  })

  it('deve abrir modal de edição ao clicar no botão editar', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Encontrar primeiro botão de editar
    const editButtons = screen.getAllByLabelText('Editar produto')
    await user.click(editButtons[0])
    
    await waitFor(() => {
      expect(screen.getByText('Editar Produto')).toBeInTheDocument()
      expect(screen.getByText('Atualizar')).toBeInTheDocument()
    })
  })

  it('deve confirmar exclusão de produto', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Encontrar primeiro botão de deletar (ícone Trash2)
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.className.includes('text-red-600')
    )
    await user.click(deleteButtons[0])
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produto?')
    })
  })

  it('deve exibir alerta de estoque baixo', () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Óleo de Soja tem estoque 0, deve mostrar alerta
    expect(screen.getByText('Óleo de Soja 900ml')).toBeInTheDocument()
    
    // Verificar se há indicador de estoque baixo
    const stockElements = screen.getAllByText(/unidades/)
    const lowStockElement = stockElements.find(el => 
      el.textContent?.includes('0 unidades')
    )
    expect(lowStockElement).toBeInTheDocument()
  })

  it('deve filtrar por categoria', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    const categorySelect = screen.getByDisplayValue('Todas as categorias')
    await user.selectOptions(categorySelect, 'Bebidas')
    
    await waitFor(() => {
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
      expect(screen.queryByText('Pão de Açúcar')).not.toBeInTheDocument()
    })
  })

  it('deve resetar filtros', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Aplicar filtros
    const searchInput = screen.getByPlaceholderText('Buscar por nome, código de barras ou categoria...')
    await user.type(searchInput, 'Coca')
    
    // Resetar filtros
    const resetButton = screen.getByText('Resetar Filtros')
    await user.click(resetButton)
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
      expect(screen.getByText('Coca-Cola 2L')).toBeInTheDocument()
      expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando nenhum produto é encontrado', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome, código de barras ou categoria...')
    await user.type(searchInput, 'Produto Inexistente')
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
    })
  })

  it('deve fechar modal ao clicar em cancelar', async () => {
    render(<Products />, { wrapper: TestWrapper })
    
    // Abrir modal
    const newButton = screen.getByText('Novo Produto')
    await user.click(newButton)
    
    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })
    
    // Fechar modal
    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument()
    })
  })
})
