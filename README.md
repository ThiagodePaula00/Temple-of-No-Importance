# Temple of No Importance

## Executar com Docker Compose

Pré-requisitos: Docker e o plugin Docker Compose.

1. Na raiz do projeto, crie o arquivo `backend/.env` a partir do exemplo:

   ```sh
   cp backend/.env.example backend/.env
   ```

2. Abra `backend/.env` e substitua `POSTGRES_PASSWORD` pela senha que deseja usar. É nesse arquivo — e não no Dockerfile ou no Compose — que você configura as variáveis do banco. O Compose lê esse arquivo para configurar o PostgreSQL e disponibiliza os mesmos valores ao backend. `backend/.env` é local e não deve ser compartilhado ou enviado ao repositório; apenas `backend/.env.example`, sem senha real, fica no projeto.
3. Na raiz do projeto, inicie o PostgreSQL, o backend e o frontend com um único comando:

   ```sh
   docker compose up --build
   ```

   Para iniciar em segundo plano, use `docker compose up --build -d`.

- Frontend: <http://localhost:3001>
- Backend: <http://localhost:3000>
- PostgreSQL: `localhost:5432` (porta padrão)

O Compose aguarda o PostgreSQL ficar saudável antes de iniciar o backend. Os dados do banco são persistidos no volume `postgres_data`. As imagens usam Node.js 26 e PostgreSQL 18. O serviço PostgreSQL utiliza o banco e o usuário definidos em `backend/.env`; os mesmos valores ficam disponíveis ao backend, com `DB_HOST=postgres` e `DB_PORT=5432` para conexão entre containers.

Para encerrar os serviços, execute `docker compose down`. Para também remover os dados persistidos do banco, execute `docker compose down -v`.

## Execução local

Para desenvolver sem Docker, instale as dependências em `backend/` e `frontend/` com `npm ci` e inicie cada aplicação em seu diretório com `npm run start:dev` (backend) e `npm run dev -- --port 3001` (frontend). O PostgreSQL precisa estar disponível separadamente se a aplicação passar a utilizá-lo.
