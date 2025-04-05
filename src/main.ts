import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      //url: 'localhost:50051',
      package: 'rag',
      protoPath: '../rag_system/proto/rag.proto',
      loader: {keepCase: true}
    },
  });
  await app.listen();
  console.log("gRPC Prompt Microservice is running...");
}
bootstrap();
