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

  // Lado "inverso" de la relación muchos-a-muchos: `mappedBy` (acá,
  // el segundo argumento de la función) vive del lado que NO tiene @JoinTable.
  @ManyToMany(() => Libro, (libro) => libro.autores)
  libros!: Libro[];
}
