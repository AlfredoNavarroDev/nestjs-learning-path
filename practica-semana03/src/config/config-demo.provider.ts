export interface AppConfig {
  appName: string;
  entorno: string;
}

export const APP_CONFIG = 'APP_CONFIG';

// ── TODO 5: convertir esto en un custom provider useFactory que lea
// process.env.APP_NAME (default 'Biblioteca') y process.env.NODE_ENV
// (default 'development') ───────────────────────────────────────
export const appConfigProvider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfig => ({
    appName: 'TODO',
    entorno: 'TODO',
  }),
};
