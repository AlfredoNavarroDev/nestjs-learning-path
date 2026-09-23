import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from '../libros/libro.entity';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  nacionalidad!: string | null;

  @ManyToMany(() => Libro, (libro) => libro.autores)
  libros!: Libro[];
}
