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

  @Column({ type: 'boolean', default: false })
  prestado!: boolean;

  // Un libro puede tener varios autores y un autor varios libros.
  // @JoinTable() marca este lado como el "dueño" de la relación: TypeORM
  // crea la tabla intermedia `libros_autores_autores` automáticamente.
  @ManyToMany(() => Autor, (autor) => autor.libros)
  @JoinTable()
  autores!: Autor[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  prestamos!: Prestamo[];
}
