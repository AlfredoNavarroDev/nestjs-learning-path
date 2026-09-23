import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from '../libros/libro.entity';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  nacionalidad!: string | null;

  // ── TODO 5: @ManyToMany(() => Libro, libro => libro.autores) ──
  // (lado inverso: SIN @JoinTable, esa va en Libro) ───────────
  libros!: Libro[];
}
