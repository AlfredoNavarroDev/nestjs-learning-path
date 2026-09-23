import { Module } from '@nestjs/common';
import { ConfigDemoController } from './config-demo.controller';

@Module({
  controllers: [ConfigDemoController],
})
export class ConfigDemoModule {}
