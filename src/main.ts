import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

   const config = new DocumentBuilder()
    .setTitle('API de Adopción de Animales')
    .setDescription('Gestión de animales, usuarios y solicitudes de adopción')
    .setVersion('1.0')
    .addBearerAuth()        // habilita el botón "Authorize" para JWT
    .addServer('http://localhost:3000', 'Local')
    .addServer('https://api.miapp.com',  'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // La UI queda en http://localhost:3000/api/docs
  // El JSON queda en http://localhost:3000/api/docs-json


  await app.listen(3000);
}
bootstrap();
