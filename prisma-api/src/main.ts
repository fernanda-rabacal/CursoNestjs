import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { UnauthorizedInterceptor } from "./common/errors/interceptors/unauthorized.interceptor";
import { NotFoundInterceptor } from "./common/errors/interceptors/not-found.interceptor";
import { DatabaseInterceptor } from "./common/errors/interceptors/database.interceptor";
import { ConflictInterceptor } from "./common/errors/interceptors/conflict.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Simple blog")
    .setDescription("Simple blog API description")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  //app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //ignorar propriedades diferentes das que estão nos DTOs
      forbidNonWhitelisted: true, //recusar requisições com propriedades não listadas nos DTOs
      transform: true, //converter automaticamente os valores da requisição nos tipos indicados nos DTOs
    }),
  );

  app.useGlobalInterceptors(
    new ConflictInterceptor(),
    new DatabaseInterceptor(),
    new UnauthorizedInterceptor(),
    new NotFoundInterceptor(),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
