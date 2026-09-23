import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';

@Injectable()
export class AutoresService {
  // @InjectRepository(Autor): Nest inyecta un Repository<Autor> ya tipado y
  // conectado a la tabla `autores` (equivalente a un `JpaRepository<Autor, UUID>`
  // que Spring genera solo con extender la interfaz).
  constructor(
    @InjectRepository(Autor) private readonly autoresRepo: Repository<Autor>,
  ) {}

  findAll(): Promise<Autor[]> {
    return this.autoresRepo.find();
  }

  findOne(id: string): Promise<Autor | null> {
    return this.autoresRepo.findOneBy({ id });
  }

  async existe(id: string): Promise<boolean> {
    return (await this.autoresRepo.countBy({ id })) > 0;
  }

  create(data: Omit<Autor, 'id'>): Promise<Autor> {
    const autor = this.autoresRepo.create(data);
    return this.autoresRepo.save(autor);
  }
}
