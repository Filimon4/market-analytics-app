import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from './common/constants/environment-variables.type';
import metadata from './metadata';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { join } from 'path';
import { AuthPublicModule } from './modules/auth/auth.public.module';

// TODO: Добавть проверку доступности роли для действий. То добавить проверку на возможность совершать дейтвие по ручке
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync(join(__dirname, '..', 'certs', 'localhost+2-key.pem')),
      cert: fs.readFileSync(join(__dirname, '..', 'certs', 'localhost+2.pem')),
    },
  });
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

  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefixURL, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const developerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Документация API для разработчиков')
    .setVersion('1.0')
    .build();

  const developerDocument = SwaggerModule.createDocument(app, developerConfig, {
    include: [AuthPublicModule],
  });
  SwaggerModule.setup('open-crm-api', app, developerDocument);

  const logger = new Logger('Bootstrap');
  const port = configService.get<number>(EnvironmentVariablesType.HTTP_PORT)!;
  const host = configService.get<string>(EnvironmentVariablesType.HTTP_HOST)!;

  await app.listen(port, host).then(() => {
    (logger.log(`📚 Swagger доступен по адресу https://127.0.0.1:${port}${swaggerPrefixURL}`),
      logger.log(`🚀 Приложение запущено по адресу https://127.0.0.1:${port}`));
  });
}
bootstrap();
