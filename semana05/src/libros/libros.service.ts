import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { AutoresService } from '../autores/autores.service';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private readonly librosRepo: Repository<Libro>,
    private readonly autoresService: AutoresService,
  ) {}

  findAll(): Promise<Libro[]> {
    return this.librosRepo.find();
  }

  findOne(id: string): Promise<Libro | null> {
    return this.librosRepo.findOneBy({ id });
  }

  async create(data: Omit<Libro, 'id'>): Promise<Libro> {
    if (!(await this.autoresService.existe(data.autorId))) {
      throw new Error(`Autor ${data.autorId} no existe`);
    }
    // create() arma la instancia en memoria (sin tocar la BD todavía);
    // save() hace el INSERT (o UPDATE si ya tiene id). Distinto de
    // update(), que hace un UPDATE directo sin traer la fila primero.
    const libro = this.librosRepo.create(data);
    return this.librosRepo.save(libro);
  }

  async update(id: string, data: Partial<Libro>): Promise<Libro | null> {
    await this.librosRepo.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.librosRepo.delete({ id });
  }
}
