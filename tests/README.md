# Testes da API de Futebol

Esta documentação descreve a estrutura de testes da aplicação e como executá-los.

## Estrutura dos Testes

```
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

## Como Executar os Testes

### Todos os testes
```bash
npm test
```

### Testes com coverage
```bash
npm run test:coverage
```

### Testes em modo watch
```bash
npm run test:watch
```

### Testes unitários apenas
```bash
npm run test:unit
```

### Testes de integração apenas
```bash
npm run test:integration
```

### Testes por categoria
```bash
# Apenas services
npm run test:services

# Apenas controllers
npm run test:controllers

# Apenas repositories
npm run test:repositories
```

### Para CI/CD
```bash
npm run test:ci
```

## Configuração

### Jest
O Jest está configurado para:
- Usar TypeScript com `ts-jest`
- Executar testes em ambiente Node.js
- Coletar coverage dos arquivos em `src/`
- Usar MongoDB Memory Server para testes de integração
- Executar setup antes dos testes

### MongoDB Memory Server
Para testes de integração, usamos o MongoDB Memory Server que:
- Cria uma instância temporária do MongoDB na memória
- Limpa os dados entre cada teste
- Não requer instalação do MongoDB

### Mocks
Os mocks estão centralizados em `tests/mocks/index.ts` e incluem:
- Mock de usuário
- Mock de time
- Mock de liga
- Mock de partida
- Mock de notificação
- Mock de resposta da API de futebol

## Tipos de Testes

### Testes Unitários
Testam componentes individuais isoladamente:
- **Services**: Lógica de negócio
- **Controllers**: Manipulação de requisições HTTP
- **Repositories**: Acesso a dados
- **Integrations**: APIs externas
- **Events**: Sistema de eventos
- **Config**: Configurações da aplicação

### Testes de Integração
Testam o fluxo completo da aplicação:
- Requisições HTTP end-to-end
- Interação com banco de dados real (em memória)
- Validação de dados persistidos

## Cobertura de Testes

O relatório de cobertura inclui:
- **Statements**: Linhas de código executadas
- **Branches**: Condições testadas
- **Functions**: Funções chamadas
- **Lines**: Linhas cobertas

Meta de cobertura recomendada: **80%** ou mais.

## Boas Práticas

### 1. Nomenclatura
- Arquivos de teste terminam com `.test.ts`
- Describe blocks descrevem o componente testado
- It blocks descrevem o comportamento esperado

### 2. Estrutura dos Testes
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act  
      // Assert
    });

    it('should handle error case', () => {
      // Test error scenarios
    });
  });
});
```

### 3. Mocking
- Mock dependências externas
- Use `jest.clearAllMocks()` no beforeEach
- Mock apenas o que é necessário para o teste

### 4. Assertions
- Use matchers específicos (`toEqual`, `toBe`, `toHaveBeenCalledWith`)
- Teste tanto casos positivos quanto negativos
- Verifique efeitos colaterais

### 5. Dados de Teste
- Use factories ou builders para criar dados
- Mantenha dados de teste pequenos e focados
- Reutilize mocks quando possível

## Debugging

### Executar teste específico
```bash
npm test -- user.service.test.ts
```

### Debug com breakpoints
```bash
npm run test:debug
```

### Verbose output
```bash
npm run test:verbose
```

## CI/CD

Para integração contínua, use:
```bash
npm run test:ci
```

Este comando:
- Executa todos os testes uma vez
- Gera relatório de cobertura
- Não fica em modo watch
- Adequado para pipelines de CI/CD

## Troubleshooting

### MongoDB Memory Server
Se houver problemas com o MongoDB Memory Server:
```bash
# Limpar cache
npx jest --clearCache

# Verificar se todas as dependências estão instaladas
npm install
```

### TypeScript
Para problemas de compilação:
```bash
# Verificar configuração do TypeScript
npx tsc --noEmit
```

### Timeout
Se os testes estão com timeout:
- Aumente o timeout no jest.config.js
- Verifique se há operações assíncronas não aguardadas
- Use `await` em operações de banco de dados