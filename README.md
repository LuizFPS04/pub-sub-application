## Estrutura de pastas

```
src/
├── app.ts                       # Configuração da aplicação com as demais dependências
├── server.ts                    # Configuração do servidor
├── config/
│   └── database.ts              # Configuração do banco de dados MongoDB
├── controllers/                 # Intercepta as requisições 
│   ├── league.controller.ts
│   ├── match.controller.ts
│   ├── notification.controller.ts
│   ├── team.controller.ts
│   └── user.controller.ts
├── events/                      # Responsável pela emissão dos eventos
│   └── eventEmitter.ts
├── integrations/                # Chamada nas APIs externas
│   └── footballApi.ts
├── models/                      # Definição dos modelos do Banco de Dados
│   ├── leagueModel.ts
│   ├── matchModel.ts
│   ├── notificationModel.ts
│   ├── teamModel.ts
│   ├── oddsModel.ts
│   └── userModel.ts
├── repositories/                # Abstração para comunicação com Banco de Dados
│   ├── league.repository.ts
│   ├── match.repository.ts
│   ├── notification.repository.ts
│   ├── odds.repository.ts
│   ├── team.repository.ts
│   └── user.repository.ts
├── routes/                      # Rotas da API
│   ├── index.ts
│   ├── league.routes.ts
│   ├── match.routes.ts
│   ├── team.repository.ts
│   └── user.repository.ts
├── services/                   # Responsável pelas lógicas de negócio
│   ├── league.service.ts
│   ├── match.service.ts
│   ├── notification.service.ts
│   ├── odds.service.ts
│   ├── team.service.ts
│   └── user.service.ts
├── tasks/                      # Rotinas de busca na API
│   ├── index.ts
│   ├── leagueSync.ts
│   ├── matchSync.ts
│   └── teamSync.ts
├── types/                      # Tipagem de dados
│   ├── leagueType.ts
│   ├── matchType.ts
│   ├── notificationType.ts
│   ├── teamType.ts
│   ├── oddsType.ts
│   └── userType.ts
tests/
├── setup.ts                     # Configuração global dos testes
├── mocks/
│   └── index.ts                 # Mocks reutilizáveis
├── unit/                        # Testes unitários
│   ├── services/               
│   │   ├── user.service.test.ts
│   │   ├── team.service.test.ts
│   │   └── match.service.test.ts
│   ├── controllers/            
│   │   ├── user.controller.test.ts
│   │   └── match.controller.test.ts
│   ├── repositories/           
│   │   └── team.repository.test.ts
│   ├── integrations/           
│   │   └── footballApi.test.ts
│   ├── events/                 
│   │   └── eventEmitter.test.ts
│   └── config/                 
│       └── database.test.ts
└── integration/                 # Testes de integração
    └── user.integration.test.ts
```