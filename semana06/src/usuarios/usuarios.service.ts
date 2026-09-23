import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  findOne(id: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOneBy({ id });
  }

  // Relación uno-a-muchos cargada explícita: sin esto, `usuario.prestamos`
  // vendría undefined (no es `eager`, a propósito).
  findConPrestamos(id: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({
      where: { id },
      relations: ['prestamos', 'prestamos.libro'],
    });
  }
}
