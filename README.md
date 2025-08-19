# Documentação da API de Futebol

## Visão Geral

Esta API fornece informações sobre o Campeonato Brasileiro de Futebol, permitindo gerenciar ligas, times, partidas, usuários e notificações. A API integra com a Football Data API para sincronização automática de dados.

### Branch Dev contém os testes

## Tecnologias Utilizadas

- **Node.js** com TypeScript
- **Express.js** para criação da API REST
- **MongoDB** com Mongoose para persistência de dados
- **Socket.IO** para notificações em tempo real
- **Bcrypt** para criptografia de senhas
- **Cron** para tarefas agendadas
- **Football Data API** para dados externos

## Base URL

```
http://localhost:5000/api/v1
```

## Arquitetura

A API segue uma arquitetura em camadas:

- **Controllers**: Interceptam as requisições HTTP
- **Services**: Contêm a lógica de negócio
- **Repositories**: Abstraem a comunicação com o banco de dados
- **Models**: Definem os esquemas do MongoDB
- **Events**: Gerenciam eventos em tempo real
- **Tasks**: Executam sincronizações automáticas

## Modelos de Dados

### Usuario (User)
```typescript
{
  _id: ObjectId,
  name: string,
  email: string, // único
  password: string, // criptografado
  followedTeams: ObjectId[], // times seguidos
  isActive: boolean // padrão: true
}
```

### Time (Team)
```typescript
{
  _id: ObjectId,
  id: number, // ID da API externa
  name: string,
  shortName: string,
  tla: string, // código de 3 letras
  crest?: string, // URL do escudo
  website?: string,
  clubColors?: string,
  stadium?: string,
  position?: number,
  playedGames?: number,
  form?: string,
  won?: number,
  draw?: number,
  lost?: number,
  points?: number,
  goalsFor?: number,
  goalsAgainst?: number,
  goalDifference?: number,
  leagueId?: ObjectId
}
```

### Liga (League)
```typescript
{
  _id: ObjectId,
  name: string,
  country: string,
  season: string,
  teams: ObjectId[], // referências aos times
  leagueId: number // ID da API externa
}
```

### Partida (Match)
```typescript
{
  _id: ObjectId,
  id: string, // ID da API externa
  matchName: string,
  homeTeam: {
    id: number,
    name: string,
    shortName: string,
    tla: string,
    crest: string
  },
  awayTeam: {
    id: number,
    name: string,
    shortName: string,
    tla: string,
    crest: string
  },
  date: Date,
  score: {
    home: number,
    away: number
  },
  status: "TIMED" | "IN_PLAY" | "FINISHED",
  leagueId: ObjectId,
  events: MatchEvent[],
  referee?: string,
  stadium?: string
}
```

### Notificação (Notification)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: string,
  message: string,
  teams?: string[],
  matchId?: ObjectId
}
```

## Endpoints da API

### 👥 Usuários

#### POST /api/v1/user
Cria um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "followedTeams": ["objectId1", "objectId2"]
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { /* dados do usuário */ }
}
```

#### GET /api/v1/users
Lista todos os usuários.

**Resposta (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [/* array de usuários */]
}
```

#### GET /api/v1/user/:id
Busca usuário por ID.

**Resposta (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": { /* dados do usuário */ }
}
```

#### GET /api/v1/user?mail=email
Busca usuário por email.

**Query Params:**
- `mail`: Email do usuário

### ⚽ Times

#### POST /api/v1/team
Cria um novo time.

**Body:**
```json
{
  "id": 123,
  "name": "Flamengo",
  "shortName": "Flamengo",
  "tla": "FLA",
  "website": "https://flamengo.com.br",
  "clubColors": "Vermelho / Preto",
  "stadium": "Maracanã"
}
```

#### GET /api/v1/teams
Lista todos os times.

#### GET /api/v1/team/:id
Busca time por ID.

#### PUT /api/v1/team/:id
Atualiza dados de um time.

#### DELETE /api/v1/team/all
Remove todos os times.

### 🏆 Ligas

#### POST /api/v1/league
Sincroniza dados da liga com a API externa.

#### GET /api/v1/leagues
Lista todas as ligas.

#### GET /api/v1/league/:id
Busca liga por ID.

#### PUT /api/v1/league/:id
Atualiza dados de uma liga.

#### DELETE /api/v1/league/all
Remove todas as ligas.

### 🏟️ Partidas

#### POST /api/v1/match
Cria uma nova partida.

**Body:**
```json
{
  "homeTeam": {
    "id": 123,
    "name": "Flamengo",
    "shortName": "FLA"
  },
  "awayTeam": {
    "id": 456,
    "name": "Vasco",
    "shortName": "VAS"
  },
  "date": "2025-08-20T19:30:00Z",
  "score": {
    "home": 2,
    "away": 1
  },
  "status": "FINISHED",
  "leagueId": "objectId",
  "referee": "Árbitro Silva",
  "stadium": "Maracanã"
}
```

#### GET /api/v1/matches
Lista todas as partidas.

#### GET /api/v1/match?id=matchId
Busca partida por ID.

#### GET /api/v1/match?leagueId=leagueId
Lista partidas de uma liga.

#### PUT /api/v1/match/:id
Atualiza dados de uma partida.

## Eventos em Tempo Real (WebSocket)

A API utiliza Socket.IO para notificações em tempo real. Os clientes podem se conectar e receber eventos automaticamente.

### Conectando ao Socket

```javascript
const socket = io('http://localhost:5000', {
  query: { userId: 'seu-user-id' }
});
```

### Eventos Emitidos

#### newMatch
Emitido quando uma nova partida é criada.
```json
{
  "home": "FLA",
  "away": "VAS"
}
```

#### matchUpdated
Emitido quando uma partida é atualizada.
```json
{
  "home": "FLA",
  "away": "VAS",
  "score": { "home": 2, "away": 1 },
  "status": "FINISHED",
  "changedFields": ["score", "status"]
}
```

#### updateTable
Emitido quando a tabela de classificação é atualizada.

#### insertLeague
Emitido quando uma nova liga é inserida.

## Tarefas Automáticas (Cron Jobs)

### Sincronização de Liga
- **Frequência**: Primeiro dia de cada mês às 05:00
- **Cron**: `0 5 1 * *`
- **Função**: Sincroniza dados da liga e times

### Sincronização de Partidas
- **Frequência**: A cada hora a cada minuto
- **Cron**: `* * * * *`
- **Função**: Sincroniza partidas do dia atual

### Sincronização de Tabela
- **Frequência**: Diariamente às 07:00
- **Cron**: `0 7 * * *`
- **Função**: Atualiza classificação dos times

## Integração com Football Data API

A API se integra com a Football Data API para obter dados atualizados:

- **Endpoint Base**: `https://api.football-data.org/v4`
- **Competição**: Brasileirão Série A (BSA)
- **Headers**: `X-Auth-Token: {API_KEY}`

### Funções de Integração

- `getCompetition()`: Dados da competição
- `getMatches(params)`: Lista de partidas
- `getTeams()`: Times da competição
- `getStanding(season)`: Tabela de classificação
- `getNormalizedMatches(params)`: Partidas normalizadas
- `getNormalizedTeams()`: Times normalizados

## Configuração do Ambiente

### Variáveis de Ambiente

```env
DB_URI=mongodb://localhost:27017/football
FOOTBALL_API_KEY=sua-chave-da-api
PORT=3000
```

### Iniciando a Aplicação

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## Sistema de Notificações

O sistema de notificações funciona da seguinte forma:

1. Usuários seguem times específicos
2. Eventos de partidas (criação, atualização) são detectados
3. Sistema identifica usuários que seguem os times envolvidos
4. Notificações são enviadas via WebSocket
5. Registros de notificação são salvos no banco de dados

## Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "success": false,
  "message": "Mensagem de erro específica"
}
```

### Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro na requisição
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## Segurança

- Senhas são criptografadas com bcrypt
- Emails são únicos no sistema
- Validação de dados de entrada
- Sanitização de parâmetros de consulta

## Estrutura de Resposta Padrão

```json
{
  "success": boolean,
  "message": string,
  "data": object | array (opcional)
}
```

## Considerações de Performance

- Uso de índices no MongoDB
- Paginação implementada quando necessário
- Cache de dados frequentemente acessados
- Otimização de consultas com populate()

## Limitações

- API Football Data tem limite de requisições
- Sincronizações são executadas em horários específicos
- Dependência de conectividade com API externa
- Dados históricos limitados pela API externa
