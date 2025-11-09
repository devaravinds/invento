import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PORT } from './config/system.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Invento")
    .setDescription("Invento API Documentation")
    .addBearerAuth()
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.redirect('/api');
  });
  await app.listen(PORT);
}
bootstrap();
