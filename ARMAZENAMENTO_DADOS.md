# 💾 Armazenamento de Dados - Sistema PDV

## 🎯 **Resposta Direta: Onde os dados estão salvos?**

Os dados estão sendo salvos **automaticamente** no **localStorage do navegador**. Isso significa que:

✅ **Persistem** quando você recarrega a página  
✅ **Persistem** quando fecha e abre o navegador  
✅ **Persistem** quando reinicia o computador  
❌ **São perdidos** apenas quando limpa dados do navegador  

---

## 📁 **Localização Técnica dos Dados**

### **No Navegador:**
```
Ferramentas de Desenvolvedor > Application > Local Storage > localhost:5173
```

### **Chaves de Armazenamento:**
- `pdv_products` - Produtos cadastrados
- `pdv_customers` - Clientes cadastrados  
- `pdv_sales` - Vendas realizadas

### **No Sistema de Arquivos:**
```bash
# Chrome/Edge (Windows)
C:\Users\[USER]\AppData\Local\Google\Chrome\User Data\Default\Local Storage\

# Firefox (Windows) 
C:\Users\[USER]\AppData\Roaming\Mozilla\Firefox\Profiles\[PROFILE]\storage\default\

# Dados específicos do PDV estarão nas chaves que começam com "pdv_"
```

---

## 🔄 **Como Funciona a Persistência**

### **Salvamento Automático:**
```typescript
// Sempre que você:
- Adiciona um produto ➜ Salva automaticamente
- Faz uma venda ➜ Salva automaticamente  
- Cadastra cliente ➜ Salva automaticamente
- Modifica qualquer dado ➜ Salva automaticamente
```

### **Carregamento Automático:**
```typescript
// Quando abre o sistema:
1. Verifica se há dados salvos no localStorage
2. Se encontrar ➜ Carrega os dados salvos
3. Se não encontrar ➜ Usa dados de exemplo (mock)
```

---

## 📊 **Status Atual dos Dados**

### **✅ Implementado (localStorage)**
- ✅ Salvamento automático de produtos
- ✅ Salvamento automático de clientes  
- ✅ Salvamento automático de vendas
- ✅ Carregamento automático na inicialização
- ✅ Backup/export para arquivo JSON
- ✅ Importação de dados de backup
- ✅ Limpeza completa dos dados
- ✅ Informações de uso do storage

### **🚧 Próximas Melhorias**
- 🚧 Banco SQLite real (para maior robustez)
- 🚧 Sincronização em nuvem
- 🚧 Backup automático agendado
- 🚧 Versionamento de dados
- 🚧 Compressão dos dados

---

## 🛠️ **Como Gerenciar os Dados**

### **1. Acessar Gerenciamento:**
```
Sistema PDV ➜ Aba "Dados" ➜ Gerenciamento de Dados
```

### **2. Fazer Backup:**
```
1. Clique em "Exportar Backup"
2. Arquivo JSON será baixado automaticamente
3. Guarde em local seguro (Dropbox, Google Drive, etc.)
```

### **3. Restaurar Backup:**
```
1. Abra o arquivo JSON em um editor de texto
2. Copie todo o conteúdo
3. Cole na área de importação
4. Clique em "Importar Dados"
```

### **4. Ver Informações:**
```
Na aba "Dados" você vê:
- Quantos produtos estão cadastrados
- Quantos clientes existem  
- Quantas vendas foram feitas
- Tamanho total dos dados
```

---

## 🔒 **Segurança e Backup**

### **⚠️ Importante:**
- Os dados ficam **apenas no computador** onde está rodando
- **Faça backups regulares** (recomendado: diário/semanal)
- **Não limpe dados do navegador** sem antes fazer backup
- **Teste a restauração** do backup periodicamente

### **🛡️ Recomendações:**
1. **Backup Diário**: Exporte dados todo final de expediente
2. **Backup Múltiplo**: Salve em mais de um local (HD + nuvem)
3. **Teste Mensal**: Teste se consegue restaurar o backup
4. **Documentação**: Mantenha instruções para a equipe

---

## 📈 **Evolução do Sistema**

### **Fase 1 (Atual): localStorage** ✅
- Dados salvos no navegador
- Backup manual via JSON
- Adequado para uso local

### **Fase 2 (Futura): SQLite** 🚧  
- Banco de dados real local
- Melhor performance
- Queries mais avançadas

### **Fase 3 (Futura): Nuvem** 🚧
- Sincronização automática  
- Acesso multi-dispositivo
- Backup automático

---

## 🆘 **Solução de Problemas**

### **❓ "Perdi todos os dados!"**
```
1. Verifique se está no mesmo navegador
2. Verifique se não limpou dados do navegador
3. Restaure do último backup JSON
4. Se necessário, recadastre dados essenciais
```

### **❓ "Sistema está lento"**
```
1. Vá em "Dados" ➜ Ver informações
2. Se > 1MB, faça limpeza de vendas antigas
3. Exporte backup antes de limpar
```

### **❓ "Como migrar para outro computador?"**
```
1. Computador Atual: Exportar backup
2. Computador Novo: Instalar sistema PDV  
3. Importar backup no novo computador
4. Verificar se todos os dados estão corretos
```

---

## 📞 **Suporte**

Para dúvidas sobre armazenamento de dados:
1. Consulte a aba "Dados" no sistema
2. Verifique este documento
3. Teste backup/restauração
4. Mantenha backups atualizados

**Lembre-se: Seus dados são preciosos! Faça backups regulares! 💾**
