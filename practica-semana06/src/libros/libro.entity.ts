import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  // ── TODO 4: @ManyToMany(() => Autor, autor => autor.libros) + @JoinTable()
  // (este es el lado "dueño" de la relación: acá va @JoinTable) ────
  autores!: Autor[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  prestamos!: Prestamo[];
}
