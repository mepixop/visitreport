import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
const hbs = require('hbs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  // app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  const partialsPath = join(__dirname, '..', 'src/views/partials');
  app.useStaticAssets(join(__dirname, '..', 'src'));

  app.setViewEngine('hbs');
  hbs.registerPartials(partialsPath);
  hbs.registerHelper('eq', (a, b) => a === b);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
