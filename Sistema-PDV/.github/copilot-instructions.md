<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sistema PDV Mercado Betel - Instruções para Copilot

Este é um sistema PDV (Ponto de Venda) desenvolvido para o Mercado Betel usando:

## Stack Tecnológica
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron (aplicação nativa)
- **Banco de Dados**: SQLite (simula Access, mas gratuito)
- **Build Tool**: Vite
- **Icons**: Lucide React

## Estrutura do Projeto
- `/src/components/Layout/` - Componentes de layout (Sidebar, Header)
- `/src/pages/` - Páginas principais (Dashboard, Sales, Products, Customers, Reports)
- `/src/contexts/` - Context API para gerenciamento de estado
- `/electron/` - Código do Electron (main process, preload)

## Funcionalidades Principais
1. **Tela de Vendas**: Leitura de código de barras, carrinho, formas de pagamento
2. **Cadastro de Produtos**: CRUD completo com controle de estoque
3. **Cadastro de Clientes**: Gestão de dados dos clientes
4. **Dashboard**: Métricas e visão geral do negócio
5. **Relatórios**: Analytics de vendas, produtos e clientes

## Padrões de Código
- Use TypeScript para type safety
- Componentes funcionais com hooks
- Context API para estado global
- Tailwind CSS para estilização
- Lucide React para ícones
- Nomenclatura em português para UI
- Código e comentários em português quando aplicável

## Dados Mockados
- Atualmente usa dados em memória para demonstração
- Futuramente será integrado com SQLite real
- Mantém estrutura compatível com banco de dados relacional

## Características do Sistema
- Interface moderna e intuitiva
- Responsivo para diferentes tamanhos de tela
- Atalhos de teclado para agilidade
- Validações de dados
- Mensagens de feedback ao usuário
- Exportação de relatórios

## Próximos Passos
1. Integração com SQLite real
2. Sistema de backup automático
3. Impressão de cupons fiscais
4. Sistema de usuários e permissões
5. Integração com balanças e scanners
