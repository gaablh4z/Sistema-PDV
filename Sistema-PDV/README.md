# 🏪 Sistema PDV - Mercado Betel

Um sistema completo de Ponto de Venda (PDV) desenvolvido especialmente para o Mercado Betel. Uma solução moderna, gratuita e independente de mensalidades!

## ✨ Características

- 🖥️ **Aplicação Desktop** - Roda nativamente no Windows
- 🎨 **Interface Moderna** - Design limpo e intuitivo 
- 📱 **Responsivo** - Funciona em diferentes tamanhos de tela
- 🚀 **Rápido e Eficiente** - Construído com tecnologias modernas
- 💾 **Banco de Dados Local** - SQLite (gratuito, similar ao Access)
- 🔄 **Backup Automático** - Seus dados sempre seguros

## 🚀 Funcionalidades

### 💰 Vendas
- Leitura de código de barras
- Busca rápida de produtos
- Carrinho de compras interativo
- Múltiplas formas de pagamento (Dinheiro, Cartão, PIX)
- Finalização rápida de vendas

### 📦 Gestão de Produtos
- Cadastro completo de produtos
- Controle de estoque em tempo real
- Alertas de estoque baixo
- Categorização de produtos
- Código de barras personalizado

### 👥 Clientes
- Cadastro de clientes
- Histórico de compras
- Dados de contato organizados

### 📊 Dashboard
- Métricas em tempo real
- Vendas do dia
- Produtos mais vendidos
- Alertas importantes

### 📈 Relatórios
- Relatórios de vendas por período
- Análise de produtos
- Dados de clientes
- Exportação de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Desktop**: Electron
- **Banco de Dados**: SQLite
- **Build**: Vite
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 16 ou superior
- NPM ou Yarn

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd PDV
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em modo desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Para executar como aplicação desktop**
   ```bash
   npm run electron-dev
   ```

## 📦 Build para Produção

```bash
# Build da aplicação
npm run build

# Gerar executável do Electron
npm run electron-pack
```

## 🎯 Como Usar

### Primeira Vez
1. Abra o sistema
2. Cadastre alguns produtos básicos
3. Configure as formas de pagamento
4. Comece a vender!

### Realizando uma Venda
1. Acesse a tela "Vendas"
2. Digite ou escaneie o código de barras
3. Ajuste quantidades se necessário
4. Escolha a forma de pagamento
5. Finalize a venda

### Cadastrando Produtos
1. Vá em "Produtos"
2. Clique em "Novo Produto"
3. Preencha os dados
4. Defina preço e estoque inicial
5. Salve o produto

## 📁 Estrutura do Projeto

```
PDV/
├── electron/           # Código do Electron
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Context API
│   ├── pages/          # Páginas principais
│   └── ...
├── public/             # Arquivos estáticos
└── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build
- `npm run electron` - Executar Electron
- `npm run electron-dev` - Desenvolvimento com Electron
- `npm run electron-pack` - Gerar executável

## 💡 Dicas de Uso

- Use **Ctrl+N** para nova venda
- Use **Ctrl+P** para acessar produtos
- Use **Ctrl+C** para acessar clientes
- O sistema salva automaticamente todas as alterações
- Faça backup regular dos dados

## 🔄 Backup e Restauração

O sistema cria backups automáticos do banco de dados. Para backup manual:
1. Vá no menu "Arquivo"
2. Selecione "Backup"
3. Escolha o local para salvar

## 🐛 Problemas Conhecidos

- Em desenvolvimento: Alguns recursos ainda estão sendo implementados
- A integração com impressoras fiscais está em desenvolvimento

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Crie uma issue no GitHub
- Entre em contato através do email de suporte

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🎉 Agradecimentos

Desenvolvido com ❤️ para o Mercado Betel - Libertando negócios de mensalidades desnecessárias!

---

**Versão**: 1.0.0  
**Status**: Em desenvolvimento ativo  
**Última atualização**: Janeiro 2025
