# Exportação de Relatórios Excel - Sistema PDV Mercado Betel

## 📊 Funcionalidades de Exportação

O sistema PDV do Mercado Betel possui um robusto sistema de exportação de relatórios em formato Excel (.xlsx), permitindo análises detalhadas e profissionais dos dados do negócio.

## 🔍 Tipos de Relatórios Disponíveis

### 1. Relatório de Vendas
**Arquivo gerado:** `relatorio-vendas-YYYY-MM-DD-YYYY-MM-DD.xlsx`

**Abas incluídas:**
- **Resumo**: Informações gerais do período, total de vendas, receita, ticket médio e distribuição por forma de pagamento
- **Vendas Detalhadas**: Lista completa de todas as vendas com data, cliente, valores, forma de pagamento e itens
- **Produtos Vendidos**: Ranking dos produtos mais vendidos com quantidade e receita

### 2. Relatório de Produtos
**Arquivo gerado:** `relatorio-produtos-YYYY-MM-DD.xlsx`

**Abas incluídas:**
- **Produtos**: Lista completa com código, nome, preços, estoque e margem de lucro
- **Análise de Estoque**: Status atual do estoque com alertas e valor investido
- **Por Categoria**: Resumo agrupado por categoria de produtos

### 3. Relatório de Clientes
**Arquivo gerado:** `relatorio-clientes-YYYY-MM-DD.xlsx`

**Abas incluídas:**
- **Clientes**: Cadastro completo dos clientes
- **Histórico de Compras**: Análise do comportamento de compra de cada cliente

### 4. Relatório Executivo Completo
**Arquivo gerado:** `relatorio-executivo-completo-YYYY-MM-DD.xlsx`

**Abas incluídas (7 abas totais):**
1. **Resumo Executivo**: Dashboard executivo com KPIs principais
2. **Vendas Detalhadas**: Todas as vendas do período
3. **Produtos Vendidos**: Performance de produtos
4. **Cadastro Produtos**: Base completa de produtos
5. **Análise Estoque**: Situação detalhada do estoque
6. **Clientes Detalhado**: Base de clientes com histórico
7. **Vendas por Dia**: Análise temporal das vendas

## 🎯 Como Usar

### Passo 1: Acessar Relatórios
1. Navegue até a página "Relatórios" no menu principal
2. Defina o período de análise (data inicial e final)

### Passo 2: Exportação Individual
1. Selecione o tipo de relatório desejado (Vendas, Produtos ou Clientes)
2. Clique no botão "Exportar [Tipo]" na seção "Exportar Excel"
3. O arquivo será baixado automaticamente

### Passo 3: Relatório Executivo
1. Clique em "Relatório Executivo Excel" para gerar o relatório completo
2. Aguarde a geração (pode levar alguns segundos)
3. O arquivo com 7 abas será baixado

## 📈 Recursos Avançados

### Formatação Automática
- **Largura de Colunas**: Ajuste automático baseado no conteúdo
- **Formatação Monetária**: Valores em reais (R$) formatados
- **Dados Estruturados**: Headers claros e dados organizados

### Análises Incluídas
- **Margem de Lucro**: Calculada automaticamente para produtos
- **Status de Estoque**: Classificação automática (OK, Baixo, Sem Estoque)
- **Ticket Médio**: Por cliente, produto e período
- **Performance Temporal**: Vendas por dia

### Filtros e Períodos
- **Período Personalizável**: Selecione data inicial e final
- **Reset de Filtros**: Botão para voltar ao dia atual
- **Múltiplos Formatos**: Excel (.xlsx) e JSON

## 🔧 Tecnologias Utilizadas

- **Biblioteca:** SheetJS (XLSX) v0.18.5
- **Formato:** Excel 2007+ (.xlsx)
- **Compatibilidade:** Excel, Google Sheets, LibreOffice Calc

## 📋 Estrutura dos Dados

### Colunas Principais

**Vendas:**
- Data/Hora, Cliente, Total, Desconto, Forma Pagamento, Valor Pago, Troco, Itens

**Produtos:**
- Código, Nome, Código de Barras, Preço, Custo, Estoque, Categoria, Margem %

**Clientes:**
- Código, Nome, Email, Telefone, Total Compras, Valor Total, Última Compra, Ticket Médio

**Estoque:**
- Produto, Estoque Atual, Status, Valor em Estoque, Categoria, Ação Sugerida

## 💡 Dicas de Uso

### Para Gestores
- Use o "Relatório Executivo Completo" para visão geral do negócio
- Analise a aba "Resumo Executivo" para KPIs principais
- Monitore o "Status de Estoque" para reabastecimento

### Para Vendedores
- Consulte "Produtos Mais Vendidos" para focar em itens de giro
- Use "Vendas por Dia" para identificar padrões

### Para Financeiro
- Analise "Vendas por Forma de Pagamento"
- Monitore "Margem por Categoria"
- Acompanhe "Ticket Médio" por período

## 🚀 Funcionalidades Futuras

- [ ] Gráficos automáticos nas planilhas
- [ ] Comparativo entre períodos
- [ ] Agendamento de relatórios
- [ ] Envio automático por email
- [ ] Relatórios de comissão
- [ ] Análise de sazonalidade

## 📞 Suporte

Para dúvidas sobre exportação de relatórios:
1. Verifique se o período selecionado tem dados
2. Teste com períodos menores se houver lentidão
3. Confirme se o navegador permite downloads
4. Verifique espaço em disco disponível

## 🔄 Versão Atual

**Versão:** 1.0.0  
**Última Atualização:** 01/07/2025  
**Compatibilidade:** Excel 2007+, Google Sheets, LibreOffice Calc
