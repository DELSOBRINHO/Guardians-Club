# Guardians Club

## Visão Geral
O Guardians Club é uma plataforma educacional interativa projetada para crianças, pais e professores. O sistema oferece uma experiência de aprendizado personalizada através de conteúdo educacional, atividades interativas e recursos de acompanhamento.

## Tecnologias Utilizadas
- **Frontend**: React 18.3.1 com TypeScript
- **Estilização**: TailwindCSS
- **Roteamento**: React Router v6.22.3
- **Backend/Database**: Supabase
- **Visualização de Dados**: Recharts, Chart.js, D3.js
- **IA/ML**: LangChain, OpenAI
- **Utilitários**: date-fns, lodash

## Estrutura do Projeto
```
project/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── lib/           # Bibliotecas e utilitários
│   ├── types/         # Definições de tipos TypeScript
│   ├── services/      # Serviços e integrações
│   └── App.tsx        # Componente principal
├── public/            # Arquivos estáticos
└── package.json       # Dependências e scripts
```

## Funcionalidades Principais

### 1. Autenticação e Perfis
- Sistema de login/registro
- Diferentes tipos de usuário (criança, guardião, professor, admin)
- Perfis personalizáveis
- Gerenciamento de sessão

### 2. Conteúdo Educacional
- Histórias interativas
- Quiz educacionais
- Vídeos educativos
- Sistema de favoritos
- Recomendações personalizadas

### 3. Atividades e Recursos
- Atividades interativas
- Recursos educacionais
- Sistema de progresso
- Feedback em tempo real

### 4. Painel Administrativo
- Gerenciamento de usuários
- Upload de conteúdo
- Análise de dados
- Relatórios de progresso

### 5. Análise de Dados
- Dashboard interativo
- Visualizações de progresso
- Relatórios personalizados
- Insights baseados em IA

## Configuração do Ambiente

### Pré-requisitos
- Node.js (versão LTS recomendada)
- npm ou yarn
- Conta no Supabase
- Chaves de API necessárias

### Instalação
1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
cd project
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Estrutura de Dados

### Tabelas do Supabase
1. **profiles**
   - id: string
   - name: string
   - email: string
   - user_type: 'child' | 'guardian' | 'teacher' | 'admin'
   - avatar_url: string | null
   - bio: string | null
   - created_at: string
   - updated_at: string

2. **content**
   - id: string
   - title: string
   - type: 'story' | 'quiz' | 'video'
   - url: string
   - created_at: string
   - updated_at: string

3. **favorites**
   - id: string
   - user_id: string
   - content_id: string
   - created_at: string

4. **notifications**
   - id: string
   - user_id: string
   - title: string
   - message: string
   - type: 'info' | 'success' | 'warning' | 'error'
   - read: boolean
   - created_at: string

## Rotas da Aplicação
- `/`: Página inicial
- `/profile`: Perfil do usuário
- `/content`: Conteúdo educacional
- `/activities`: Atividades interativas
- `/resources`: Recursos educacionais
- `/admin`: Painel administrativo
- `/upload`: Upload de conteúdo

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença
Este projeto está sob a licença [INSERIR_TIPO_DE_LICENÇA]. Veja o arquivo `LICENSE` para mais detalhes.

## Contato
[INSERIR_INFORMAÇÕES_DE_CONTATO] 