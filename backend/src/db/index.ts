// Importa a função drizzle para criar a instância do ORM
// Essa versão é específica para PostgreSQL
import { drizzle } from "drizzle-orm/postgres-js";

// Importa o Pool do pacote pg
// Pool gerencia múltiplas conexões com o banco de dados
import { Pool } from "pg";

// Importa todo o schema do banco (tabelas + relações)
// Isso permite que o Drizzle conheça a estrutura do banco
import * as schema from "./schema.js";

// Importa as variáveis de ambiente (DATABASE_URL, PORT, etc.)
import { ENV } from "../config/env.js";


// Verifica se a variável DATABASE_URL existe
// Sem ela, o backend não consegue se conectar ao banco
if (!ENV.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}


// Cria um pool de conexões com o PostgreSQL
// connectionString recebe a URL completa do banco
const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
});


// Evento disparado sempre que uma nova conexão é estabelecida
// Útil para debug e confirmar que o banco conectou
pool.on("connect", () => {
    console.log("Connected to the database");
});


// Evento disparado quando ocorre um erro inesperado no pool
// Evita que erros silenciosos passem despercebidos
pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});


// Cria a instância do Drizzle ORM
// client → pool de conexões do PostgreSQL
// schema → definição das tabelas e relações
// Esse objeto `db` será usado para fazer queries no banco
export const db = drizzle({
    client: pool,
    schema,
});
