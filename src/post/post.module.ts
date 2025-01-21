import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: "f5ac5fbe23b938af4e83d5c89fa3e71ab8d38fef620e72d4c0b2b98a8dd8e473a2b75a7c2e9b4eec1d938b2e6fdbdb64e4d0d9e65f607bfe8bb7c980a6b53c67",
      signOptions: { expiresIn: "8h" },
    }),
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule { }
