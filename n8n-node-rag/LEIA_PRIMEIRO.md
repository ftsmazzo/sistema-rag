# ✅ SOLUÇÃO SIMPLES - Leia Primeiro!

## 🎯 Agora os arquivos JÁ VÊM COMPILADOS!

Você **NÃO precisa compilar** no servidor. Os arquivos `.js` já estão no repositório!

## 🚀 Instalação no n8n (EasyPanel)

### No Terminal do n8n:

```bash
# 1. Criar pasta custom
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom

# 2. Clonar apenas a pasta n8n-node-rag
git clone --depth 1 --filter=blob:none --sparse https://github.com/ftsmazzo/sistema-rag.git temp-rag
cd temp-rag
git sparse-checkout set n8n-node-rag
cd ..

# 3. Mover para o lugar certo
mv temp-rag/n8n-node-rag .
rm -rf temp-rag

# 4. Instalar (SEM COMPILAR!)
cd n8n-node-rag
npm install --production

# 5. Reiniciar o n8n no EasyPanel
```

## ✅ Depois

1. Reinicie o n8n no EasyPanel
2. Abra o n8n
3. Crie um workflow
4. Procure por "RAG Knowledge Base"
5. ✅ Deve aparecer!

## 📦 Ou: Publicar no npm (Mais Fácil)

No seu computador local:

```bash
cd n8n-node-rag
npm login
npm publish --access public
```

Depois, no servidor:
```bash
cd ~/.n8n/custom
npm install @rag-system/n8n-nodes-rag
```

## 🎉 Pronto!

Não precisa mais compilar! Os arquivos já vêm prontos!
