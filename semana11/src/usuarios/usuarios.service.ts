import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearUsuarioDto): Promise<Usuario> {
    const existente = await this.usuariosRepo.findOneBy({ email: dto.email });
    if (existente) {
      throw new ConflictException(`Ya existe un usuario con email ${dto.email}`);
    }
    const usuario = this.usuariosRepo.create(dto);
    return this.usuariosRepo.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuariosRepo.find();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no existe`);
    return usuario;
  }

  // eager: false en la entity — para traer los préstamos hay que pedirlos
  // explícito (relations), no vienen solos.
  async findConPrestamos(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({
      where: { id },
      relations: ['prestamos', 'prestamos.libro'],
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no existe`);
    return usuario;
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);
    if (dto.email && dto.email !== usuario.email) {
      const existente = await this.usuariosRepo.findOneBy({ email: dto.email });
      if (existente) {
        throw new ConflictException(`Ya existe un usuario con email ${dto.email}`);
      }
    }
    Object.assign(usuario, dto);
    return this.usuariosRepo.save(usuario);
  }

  async eliminar(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepo.remove(usuario);
  }
}
