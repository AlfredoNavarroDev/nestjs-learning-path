import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'varchar', length: 17, unique: true })
  isbn!: string;

  @Column({ type: 'int' })
  anio!: number;

  @Column({ type: 'boolean', default: false })
  prestado!: boolean;

  // La relación con Autor llega recién en la semana 6 (Query Builder y
  // relaciones); esta semana el foco es Entity + Repository simple.
  @Column({ type: 'uuid' })
  autorId!: string;
}
