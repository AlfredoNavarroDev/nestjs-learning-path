import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Autor } from '../autores/autor.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

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

  @Column({ type: 'varchar', length: 60, nullable: true })
  categoria!: string | null;

  @Column({ type: 'boolean', default: false })
  prestado!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  portadaUrl!: string | null;

  @ManyToMany(() => Autor, (autor) => autor.libros)
  @JoinTable({ name: 'libros_autores' })
  autores!: Autor[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  prestamos!: Prestamo[];
}
