import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //ignorar propriedades diferentes das que estão nos DTOs
      forbidNonWhitelisted: true, //recusar requesuções com propriedades não listadas nos DTOs
      transform: true, //converter automaticamente os valores da requisição nos tipos indicados nos DTOs
    }),
  );
  await app.listen(3000);
}
bootstrap();
