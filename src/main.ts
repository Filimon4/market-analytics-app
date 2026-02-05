import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesType } from './common/constants/environment-variables.type';
import metadata from './metadata';
import { ExceptionsLogger } from './common/middleware/exceptions-logger.middleware';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { join } from 'path';

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
  app.setGlobalPrefix('api')
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ExceptionsLogger());

  const configService = app.get(ConfigService);
  const swaggerPrefixURL = configService.get<string>(
    EnvironmentVariablesType.HTTP_OPEN_API_PREFIX,
  )!;

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'x-user-id')
    .addSecurityRequirements('bearer')
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
      `📚 Swagger доступен по адресу https://127.0.0.1:${port}${swaggerPrefixURL}`,
    ),
      logger.log(`🚀 Приложение запущено по адресу https://127.0.0.1:${port}`));
  });
}
bootstrap();
