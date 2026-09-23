import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// ── TODO 5: decorar la clase con @Entity('libros') ──────────────
export class Libro {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  // ── TODO 6: @Column con type varchar, length 17, unique: true ──
  isbn!: string;

  @Column({ type: 'int' })
  anio!: number;

  @Column({ type: 'boolean', default: false })
  prestado!: boolean;

  @Column({ type: 'uuid' })
  autorId!: string;
}
