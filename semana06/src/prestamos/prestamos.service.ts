import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { LibrosService } from '../libros/libros.service';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamosRepo: Repository<Prestamo>,
    private readonly librosService: LibrosService,
  ) {}

  async crear(libroId: string, usuarioId: string): Promise<Prestamo> {
    const libro = await this.librosService.findOne(libroId);
    if (!libro) throw new NotFoundException(`Libro ${libroId} no existe`);

    const prestamo = this.prestamosRepo.create({
      libro: { id: libroId } as any,
      usuario: { id: usuarioId } as any,
    });
    const guardado = await this.prestamosRepo.save(prestamo);
    await this.librosService.marcarPrestado(libroId, true);
    return guardado;
  }

  async devolver(libroId: string): Promise<void> {
    await this.librosService.marcarPrestado(libroId, false);
  }

  findAll(): Promise<Prestamo[]> {
    return this.prestamosRepo.find({ relations: ['libro', 'usuario'] });
  }
}
