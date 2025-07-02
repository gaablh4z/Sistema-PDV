# 🎯 Guia de Uso - Sistema de Vendas PDV

## 🚀 **Início Rápido**

### 1️⃣ **Tela Principal de Vendas**
```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Ponto de Venda                    Total: R$ 0,00         │
│ Realize vendas de forma rápida e eficiente                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌────────────────────────────────┐
│ 📦 Código de Barras     │  │ 🛍️ Carrinho (0)              │
│ [________________] [🔍] │  │                                │
│                         │  │ Carrinho vazio                 │
│ 🔍 Buscar Produtos      │  │ Escaneie um código de barras   │
│ [ Expandir/Recolher ]   │  │ ou busque produtos             │
└─────────────────────────┘  └────────────────────────────────┘
```

### 2️⃣ **Adicionando Produtos**

#### **Método 1: Código de Barras**
1. Foque no campo "Código de Barras" (sempre ativo)
2. Digite ou escaneie o código
3. Pressione Enter ou clique no botão 🔍
4. Produto é adicionado automaticamente ao carrinho

#### **Método 2: Busca Manual**
1. Clique no botão 🔍 ao lado de "Buscar Produtos"
2. Digite o nome do produto
3. Clique no produto desejado na lista
4. Produto é adicionado ao carrinho

### 3️⃣ **Gerenciando o Carrinho**

```
┌────────────────────────────────────────────────────────────┐
│ 🛍️ Carrinho (2)                    [%Desconto] [🗑️Limpar] │
├────────────────────────────────────────────────────────────┤
│ Coca-Cola 2L                                               │
│ R$ 8,99 cada                     [-] 2 [+] [🗑️] R$ 17,98 │
│ Estoque disponível: 10                                     │
├────────────────────────────────────────────────────────────┤
│ Pão de Açúcar 500g                                         │
│ R$ 4,50 cada                     [-] 1 [+] [🗑️] R$ 4,50  │
│ Estoque disponível: 5                                      │
├────────────────────────────────────────────────────────────┤
│ Subtotal:                                       R$ 22,48   │
│ Desconto:                                      - R$ 2,00   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL:                                          R$ 20,48   │
└────────────────────────────────────────────────────────────┘
```

### 4️⃣ **Aplicando Desconto**

```
┌──────────────────────────────────┐
│ % Aplicar Desconto               │
├──────────────────────────────────┤
│ Tipo de Desconto:                │
│ [Porcentagem (%)] [Valor (R$)]   │
│                                  │
│ Porcentagem de Desconto:         │
│ [    10    ] %                   │
│                                  │
│ [Cancelar] [Aplicar Desconto]    │
└──────────────────────────────────┘
```

### 5️⃣ **Finalizando a Venda**

```
┌────────────────────────────────────────────────────────────┐
│ 👥 Cliente (Opcional)                                      │
│ [Selecionar Cliente ▼]                                    │
│                                                            │
│ Forma de Pagamento:                                        │
│ [💰 Dinheiro] [💳 Cartão] [📱 PIX]                        │
│                                                            │
│ ┌─ Valor Recebido (apenas dinheiro) ─────────────────────┐ │
│ │ R$ [   25,00   ]                                       │ │
│ │                                                        │ │
│ │ ✅ Troco: R$ 4,52                                      │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ [🚀 Finalizar Venda - R$ 20,48]                          │
└────────────────────────────────────────────────────────────┘
```

### 6️⃣ **Confirmação da Venda**

```
┌──────────────────────────────────┐
│ ✅ Confirmar Venda               │
├──────────────────────────────────┤
│ Subtotal:          R$ 22,48      │
│ Desconto:        - R$ 2,00       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Total:             R$ 20,48      │
│ Forma de Pagamento: Dinheiro     │
│ Valor Recebido:    R$ 25,00      │
│ Troco:             R$ 4,52       │
│ Cliente: João Silva              │
│                                  │
│ [Cancelar] [Confirmar Venda]     │
└──────────────────────────────────┘
```

### 7️⃣ **Recibo Gerado**

```
┌──────────────────────────────────┐
│ ✅ Venda Realizada!              │
│ Obrigado pela preferência        │
├══════════════════════════════════┤
│     MERCADO BETEL                │
│  Cupom Fiscal Simplificado       │
│  01/07/2025 14:30:25            │
├──────────────────────────────────┤
│ Coca-Cola 2L          R$ 17,98   │
│   2x R$ 8,99                     │
│ Pão de Açúcar 500g    R$ 4,50    │
│   1x R$ 4,50                     │
├──────────────────────────────────┤
│ Subtotal:             R$ 22,48   │
│ Desconto:           - R$ 2,00    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ TOTAL:                R$ 20,48   │
│ Pagamento: Dinheiro              │
│ Recebido:             R$ 25,00   │
│ Troco:                R$ 4,52    │
│ Cliente: João Silva              │
├──────────────────────────────────┤
│ [Fechar] [🧾 Imprimir]          │
└──────────────────────────────────┘
```

## ⚡ **Atalhos de Teclado**

```
┌─────────────────────────────┐
│ Atalhos:                    │
│ [F1]     Buscar produto     │
│ [F2]     Desconto           │
│ [F12]    Finalizar          │
│ [Ctrl+L] Limpar             │
│ [ESC]    Fechar             │
└─────────────────────────────┘
```

## 🎯 **Fluxo Recomendado**

### **Para Vendas Rápidas:**
1. **F1** → Buscar produto ou escanear código
2. Ajustar quantidades se necessário
3. **F2** → Aplicar desconto (se houver)
4. Selecionar forma de pagamento
5. **F12** → Finalizar venda

### **Para Vendas com Cliente:**
1. Adicionar produtos ao carrinho
2. Selecionar cliente na lista
3. Escolher forma de pagamento
4. Finalizar e imprimir recibo

## 🚨 **Indicadores Visuais**

- **🟢 Verde**: Valores, totais, confirmações
- **🟡 Amarelo**: Avisos, estoque baixo, descontos
- **🔴 Vermelho**: Erros, sem estoque, valores insuficientes
- **🔵 Azul**: Ações, botões, navegação

## 📱 **Responsividade**

O sistema se adapta a diferentes tamanhos de tela:
- **Desktop**: Layout de 3 colunas
- **Tablet**: Layout empilhado
- **Mobile**: Interface simplificada

---

**💡 Dica**: Mantenha sempre o foco no campo de código de barras para vendas mais rápidas!
