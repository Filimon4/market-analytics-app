import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from './common/constants/environment-variables.type';
import './common/utils/bigint.serializer';
// import metadata from './metadata';
import * as cookieParser from 'cookie-parser';
import { AuthPublicModule } from './modules/auth/auth.public.module';
import { PublicApiModule } from './modules/public/public-api.module';
import { LoggerService } from 'market-logger/logger';
import { ClsService } from 'nestjs-cls';

// TODO FEATURE: Можно добавить knex что бы писать либы для миграций, что бы делать добавление доступов и т.п.
// TODO FEATURE: Добавить поля link что бы переходить по полю на другую сущность
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new LoggerService(app.get(ClsService));

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { exposeDefaultValues: true },
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const swaggerPrefixURL = configService.get<string>(EnvironmentVariablesType.HTTP_OPEN_API_PREFIX)!;

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-tenant-id',
        description: 'Tenant identifier',
      },
      'x-tenant-id',
    )
    .addSecurityRequirements('bearer')
    .addSecurityRequirements('x-tenant-id')
    .build();

  // await SwaggerModule.loadPluginMetadata(metadata);
  const document = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefixURL, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // #region dev
  const developerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Документация API для разработчиков')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'API key for public endpoints',
      },
      'x-api-key',
    )
    .addSecurityRequirements('x-api-key')
    .build();

  const developerDocument = SwaggerModule.createDocument(app, developerConfig, {
    include: [AuthPublicModule, PublicApiModule],
  });
  SwaggerModule.setup('open-crm-api', app, developerDocument);
  // #endregion

  const port = configService.get<number>(EnvironmentVariablesType.HTTP_PORT)!;
  const host = configService.get<string>(EnvironmentVariablesType.HTTP_HOST)!;

  await app.listen(port, host).then(() => {
    (logger.log(`📚 Swagger доступен по адресу http://${host}:${port}${swaggerPrefixURL}`),
      logger.log(`🚀 Приложение запущено по адресу http://${host}:${port}`));
  });
}
bootstrap();
