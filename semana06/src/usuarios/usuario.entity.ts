import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Prestamo } from '../prestamos/prestamo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  // eager: false (default) — para traer los préstamos hay que pedirlos
  // explícito (relations: ['prestamos'] o Query Builder), no vienen solos.
  @OneToMany(() => Prestamo, (prestamo) => prestamo.usuario)
  prestamos!: Prestamo[];
}
