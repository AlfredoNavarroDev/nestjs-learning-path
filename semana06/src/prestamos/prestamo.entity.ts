import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Libro } from '../libros/libro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  fecha!: Date;

  // Uno-a-muchos visto desde el lado "muchos": cada préstamo referencia
  // UN libro y UN usuario. @JoinColumn marca dónde vive la FK (en `prestamos`).
  @ManyToOne(() => Libro, (libro) => libro.prestamos, { eager: false })
  @JoinColumn({ name: 'libro_id' })
  libro!: Libro;

  @ManyToOne(() => Usuario, (usuario) => usuario.prestamos, { eager: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;
}
