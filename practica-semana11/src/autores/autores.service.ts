import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Autor } from './autor.entity';
import { CrearAutorDto } from './dto/crear-autor.dto';
import { ActualizarAutorDto } from './dto/actualizar-autor.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor) private readonly autoresRepo: Repository<Autor>,
  ) {}

  crear(dto: CrearAutorDto): Promise<Autor> {
    const autor = this.autoresRepo.create({
      nombre: dto.nombre,
      nacionalidad: dto.nacionalidad ?? null,
    });
    return this.autoresRepo.save(autor);
  }

  findAll(): Promise<Autor[]> {
    return this.autoresRepo.find();
  }

  async findOne(id: string): Promise<Autor> {
    const autor = await this.autoresRepo.findOneBy({ id });
    if (!autor) throw new NotFoundException(`Autor ${id} no existe`);
    return autor;
  }

  // Usado por LibrosService para resolver `autoresIds` del DTO contra la
  // base real: si algún id no existe, el 404 sale desde acá, no a medias
  // en un save() que silenciosamente ignoraría el id inválido.
  async findByIds(ids: string[]): Promise<Autor[]> {
    const autores = await this.autoresRepo.find({ where: { id: In(ids) } });
    if (autores.length !== ids.length) {
      const encontrados = new Set(autores.map((a) => a.id));
      const faltantes = ids.filter((id) => !encontrados.has(id));
      throw new NotFoundException(
        `Autor(es) no encontrado(s): ${faltantes.join(', ')}`,
      );
    }
    return autores;
  }

  async actualizar(id: string, dto: ActualizarAutorDto): Promise<Autor> {
    const autor = await this.findOne(id);
    Object.assign(autor, dto);
    return this.autoresRepo.save(autor);
  }

  async eliminar(id: string): Promise<void> {
    const autor = await this.findOne(id);
    await this.autoresRepo.remove(autor);
  }
}
