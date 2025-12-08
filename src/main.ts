import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module.js';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from './common/constants/environment-variables.type.js';
import { EnvironmentTypes } from './common/constants/environment-types.type.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { exposeDefaultValues: true },
    }),
  );
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  const swaggerPrefixURL = configService.get<string>(
    EnvironmentVariablesType.HTTP_OPEN_API_PREFIX,
  )!;

  const config = new DocumentBuilder().setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get<number>(EnvironmentVariablesType.HTTP_PORT)!;
  const host = configService.get<string>(EnvironmentVariablesType.HTTP_HOST)!;

  await app.listen(port, host).then(() => {
    (console.log(
      `📚 Swagger доступен по адресу http://127.0.0.1:${port}${swaggerPrefixURL}`,
    ),
      console.log(`🚀 Приложение запущено по адресу http://127.0.0.1:${port}`));
  });
}
bootstrap();
