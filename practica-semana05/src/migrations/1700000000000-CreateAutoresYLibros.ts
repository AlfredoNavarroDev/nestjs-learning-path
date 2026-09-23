import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Migración escrita a mano (equivalente a un script de Flyway
// `V1__create_autores_libros.sql`). En un proyecto real se generaría con
// `npm run migration:generate` a partir del diff entre entities y BD.
export class CreateAutoresYLibros1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'autores',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'nombre', type: 'varchar', length: '150' },
          { name: 'nacionalidad', type: 'varchar', length: '80', isNullable: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'libros',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'titulo', type: 'varchar', length: '200' },
          { name: 'isbn', type: 'varchar', length: '17', isUnique: true },
          { name: 'anio', type: 'int' },
          { name: 'prestado', type: 'boolean', default: false },
          { name: 'autor_id', type: 'uuid' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('libros');
    await queryRunner.dropTable('autores');
  }
}
