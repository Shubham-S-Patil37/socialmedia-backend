import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

  constructor(private readonly postService: PostService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUserPost(@Req() req: any) {
    const userId = req.user?.userId
    return this.postService.getUserPost(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = './uploads';
          if (!fs.existsSync(uploadDir)) { fs.mkdirSync(uploadDir, { recursive: true }); }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = path.extname(file.originalname);
          const fileName = `${timestamp}-${file.originalname}`
          cb(null, fileName.replaceAll(' ', ""));
        },
      }),
    }),
  )
  async createUserPost(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() body: any,) {
    const userId = req.user?.userId
    return this.postService.createPost(userId, body, file)
  }

}