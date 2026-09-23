export interface AppConfig {
  appName: string;
  entorno: string;
}

export const APP_CONFIG = 'APP_CONFIG';

// Provider con useFactory: construye el valor a partir de variables de
// entorno en vez de una clase o un valor fijo. Es la base de lo que hará
// @nestjs/config con ConfigService en la semana 8.
export const appConfigProvider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfig => ({
    appName: process.env.APP_NAME ?? 'Biblioteca',
    entorno: process.env.NODE_ENV ?? 'development',
  }),
};
