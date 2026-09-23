import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config-demo')
export class ConfigDemoController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    // Nunca devolvemos jwt.secret entero por seguridad, solo su longitud
    // (ya validada en >=32 por Zod antes de que la app llegara a arrancar).
    return {
      entorno: this.configService.get<string>('app.entorno'),
      puerto: this.configService.get<number>('app.puerto'),
      databaseUrl: this.configService.get<string>('database.url'),
      jwtExpiresIn: this.configService.get<string>('jwt.expiresIn'),
      jwtSecretLength: this.configService.get<string>('jwt.secret')?.length,
    };
  }
}
