import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from 'database/db';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  connectDB()
  const app = await NestFactory.create(AppModule);
  const runningPort = 3000
  app.enableCors();


  // app.enableCors({
  //   origin: 'http://localhost:5174', // Your frontend URL
  //   methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  //   allowedHeaders: 'Content-Type, Accept', // Allowed headers
  // });

  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(runningPort);

  console.log("//////////////////////////////////////////////////////////////////")
  console.log(` .......... App running on port ${runningPort} .......... `)
  console.log("//////////////////////////////////////////////////////////////////")

}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   connectDB()
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS
//   app.enableCors({
//     origin: 'http://localhost:5174', // Your React app's URL
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//   });

//   await app.listen(8080);
// }
// bootstrap();
