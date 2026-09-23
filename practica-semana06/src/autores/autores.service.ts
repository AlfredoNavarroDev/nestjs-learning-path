import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor) private readonly autoresRepo: Repository<Autor>,
  ) {}

  findAll(): Promise<Autor[]> {
    return this.autoresRepo.find();
  }

  async existe(id: string): Promise<boolean> {
    return (await this.autoresRepo.countBy({ id })) > 0;
  }
}
