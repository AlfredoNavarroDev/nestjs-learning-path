import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity() = @Entity de JPA. @PrimaryGeneratedColumn() = @Id + @GeneratedValue.
// A diferencia de JPA (que infiere el tipo de columna desde el tipo de Java),
// acá se puede declarar explícito con `type` cuando conviene precisión.
@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  nacionalidad!: string | null;
}
