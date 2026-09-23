import { DataSource } from 'typeorm';
import { Autor } from './autores/autor.entity';
import { Libro } from './libros/libro.entity';

// DataSource usado por el CLI de TypeORM para generar y correr migraciones
// (`npm run migration:generate` / `migration:run`). Separado de
// TypeOrmModule.forRoot() de app.module.ts, que es el que usa Nest en runtime.
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'biblioteca',
  entities: [Autor, Libro],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // nunca en un entorno que no sea desarrollo local puro
});
