import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    AuthModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { } 
