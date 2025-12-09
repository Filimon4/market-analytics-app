import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from './common/constants/environment-variables.type';
import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-user-id',
        in: 'header',
      },
      'x-user-id',
    )
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefixURL, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const logger = new Logger('Bootstrap');
  const port = configService.get<number>(EnvironmentVariablesType.HTTP_PORT)!;
  const host = configService.get<string>(EnvironmentVariablesType.HTTP_HOST)!;

  await app.listen(port, host).then(() => {
    (logger.log(
      `📚 Swagger доступен по адресу http://127.0.0.1:${port}${swaggerPrefixURL}`,
    ),
      logger.log(`🚀 Приложение запущено по адресу http://127.0.0.1:${port}`));
  });
}
bootstrap();
