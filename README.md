# OutbreakAfrica

[![TypeScript](https://img.shields.io/badge/TypeScript-97.1%25-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black)](https://nextjs.org/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

**Uma plataforma de inteligência epidemiológica dedicada à monitorização em tempo real de surtos de doenças e emergências de saúde pública, com foco especial no continente africano.**

> 🚧 **Estado:** Em construção | Em pausa temporária (feedback técnico bem-vindo)

## 🎯 O Problema

Informações sobre surtos de doenças e emergências de saúde pública em África estão fragmentadas e difíceis de aceder. O **OutbreakAfrica** resolve isto agregando dados fiáveis e tornando-os acessíveis para:

- 📰 Jornalistas
- 🔬 Investigadores
- 👥 Qualquer pessoa que precise desta informação

## ✨ Características Principais

### Funcionalidades Implementadas

- ✅ **Feed de surtos por país africano** — visualize surtos organizados geograficamente
- ✅ **Filtros avançados** — por doença, país e período
- ✅ **Integração estável com ReliefWeb API** — através de Cloudflare Workers

### Próximas Features

- 📋 **Exportação multi-formato** — .md, .pdf, .xlsx, CSV e Google Sheets
- 🔄 **Comparação entre países** — análise cruzada de dados epidemiológicos
- 🔔 **Sistema de alertas por email** — com condições customizáveis

## 🛠️ Stack Técnico

```
Frontend + API Routes
├─ Next.js (App Router)
└─ React + TypeScript

Backend
└─ Cloudflare Workers (Proxy seguro)

Fonte de Dados
└─ ReliefWeb API
```

### Tecnologias

| Tecnologia | Propósito |
|-----------|----------|
| **Next.js** | Framework fullstack (Frontend + API Routes) |
| **TypeScript** | Type-safety e melhor experiência de desenvolvimento |
| **Cloudflare Workers** | Proxy seguro para a ReliefWeb API |
| **ReliefWeb API** | Fonte de dados de surtos e emergências |

## 🔐 Por que um Cloudflare Worker?

A ReliefWeb API exige headers específicos que o Next.js server-side não passava corretamente. 

**Solução:** Um Cloudflare Worker como intermediário que:

1. ✅ Resolve o problema dos headers
2. ✅ Mantém as credenciais seguras no server
3. ✅ Fornece um proxy estável e rápido

```
Cliente (Navegador)
    ↓
Next.js API Routes
    ↓
Cloudflare Worker (intermediário seguro)
    ↓
ReliefWeb API
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Cloudflare (para deployment do Worker)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/xmaj2001/OutbreakAfrica.git
cd OutbreakAfrica

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em desenvolvimento
npm run dev
```

Aceda a `http://localhost:3000` no seu navegador.

### Configuração do Cloudflare Worker

1. Crie um novo Worker na [Dashboard Cloudflare](https://dash.cloudflare.com/)
2. Deploy do Worker (ver instruções em `/worker`)
3. Configure a URL do Worker nas variáveis de ambiente

```env
NEXT_PUBLIC_WORKER_URL=https://seu-worker.seu-dominio.workers.dev
```

## 📁 Estrutura do Projeto

```
OutbreakAfrica/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página inicial
│   ├── api/               # API Routes
│   └── [country]/         # Páginas dinâmicas por país
├── components/            # Componentes React
├── lib/                   # Utilitários e helpers
├── public/                # Arquivos estáticos
├── worker/                # Cloudflare Worker code
├── styles/                # CSS
└── .env.local            # Variáveis de ambiente
```

## 📚 Documentação

- [Guia de Contribuição](./CONTRIBUTING.md) — ajude-nos a melhorar
- [ReliefWeb API Docs](https://reliefweb.int/api) — documentação da fonte de dados
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/) — learn more about Workers

## 🤝 Contribuições

Este é um **projeto open-source**. Contribuições são bem-vindas!

1. Fork o repositório
2. Crie uma branch para a sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit as suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Feedback técnico é especialmente bem-vindo!** 👇

## 📝 Licença

[Escolha a licença apropriada — p.ex. MIT, Apache 2.0, etc.]

## 🔗 Links Úteis

- 🌍 [ReliefWeb](https://reliefweb.int/) — Plataforma de informação humanitária
- ☁️ [Cloudflare](https://www.cloudflare.com/)
- ⚛️ [Next.js](https://nextjs.org/)
- 🟦 [TypeScript](https://www.typescriptlang.org/)

## 👨‍💻 Autor

**xmaj2001** — [@GitHub](https://github.com/xmaj2001)

---

**#Cloudflare** #CloudflareWorkers #NextJS #HealthData #Africa #SideProject #DevLearning

