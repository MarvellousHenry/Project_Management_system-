import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const Port = process.env.PROJECT_PORT
  await app.listen(Port, ()=>console.log(`server running on port:${Port}`));
}
bootstrap();
