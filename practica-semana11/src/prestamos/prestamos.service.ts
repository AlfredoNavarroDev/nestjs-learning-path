import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { LibrosService } from '../libros/libros.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LibroNoDisponibleException } from '../common/exceptions/libro-no-disponible.exception';

@Injectable()
export class PrestamosService {
  private readonly logger = new Logger(PrestamosService.name);

  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamosRepo: Repository<Prestamo>,
    private readonly librosService: LibrosService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async crear(libroId: string, usuarioId: string): Promise<Prestamo> {
    const libro = await this.librosService.findOne(libroId);
    if (libro.prestado) throw new LibroNoDisponibleException(libroId);
    await this.usuariosService.findOne(usuarioId);

    const prestamo = this.prestamosRepo.create({
      libro: { id: libroId } as Prestamo['libro'],
      usuario: { id: usuarioId } as Prestamo['usuario'],
    });
    const guardado = await this.prestamosRepo.save(prestamo);
    await this.librosService.marcarPrestado(libroId, true);
    this.logger.log(`Préstamo creado para el libro ${libroId}`);
    return guardado;
  }

  async devolver(libroId: string): Promise<void> {
    const prestamo = await this.prestamosRepo.findOne({
      where: { libro: { id: libroId }, fechaDevolucion: null as any },
      order: { fecha: 'DESC' },
    });
    if (!prestamo) {
      throw new NotFoundException(`No hay un préstamo activo para el libro ${libroId}`);
    }
    prestamo.fechaDevolucion = new Date();
    await this.prestamosRepo.save(prestamo);
    await this.librosService.marcarPrestado(libroId, false);
    this.logger.log(`Libro ${libroId} devuelto`);
  }

  findAll(): Promise<Prestamo[]> {
    return this.prestamosRepo.find({ relations: ['libro', 'usuario'] });
  }
}
