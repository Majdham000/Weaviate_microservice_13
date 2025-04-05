import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeaviateModule } from './weaviate/weaviate.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WeaviateModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}