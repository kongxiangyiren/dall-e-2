// 项目启动前设置时区
process.env.TZ = 'Asia/Shanghai';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.useStaticAssets('public');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT || 4444, '0.0.0.0').then(async () => {
    Logger.log(`Server running on ${await app.getUrl()}`, 'Bootstrap');
  });
}
bootstrap();
