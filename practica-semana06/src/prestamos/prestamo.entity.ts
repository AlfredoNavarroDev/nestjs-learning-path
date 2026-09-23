import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Libro } from '../libros/libro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  fecha!: Date;

  // ── TODO 2: @ManyToOne(() => Libro, libro => libro.prestamos) +
  // @JoinColumn({ name: 'libro_id' }) ─────────────────────────
  libro!: Libro;

  // ── TODO 3: @ManyToOne(() => Usuario, usuario => usuario.prestamos) +
  // @JoinColumn({ name: 'usuario_id' }) ───────────────────────
  usuario!: Usuario;
}
