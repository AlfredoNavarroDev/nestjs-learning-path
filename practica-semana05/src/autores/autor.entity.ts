import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// ── TODO 1: decorar la clase con @Entity('autores') ─────────────
export class Autor {
  // ── TODO 2: @PrimaryGeneratedColumn('uuid') ───────────────────
  id!: string;

  // ── TODO 3: @Column({ type: 'varchar', length: 150 }) ─────────
  nombre!: string;

  // ── TODO 4: @Column({ type: 'varchar', length: 80, nullable: true }) ──
  nacionalidad!: string | null;
}
