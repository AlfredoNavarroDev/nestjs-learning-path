import { Module } from '@nestjs/common';
import { ConfigDemoController } from './config-demo.controller';
import { appConfigProvider } from './config-demo.provider';

@Module({
  controllers: [ConfigDemoController],
  providers: [appConfigProvider],
})
export class ConfigDemoModule {}
