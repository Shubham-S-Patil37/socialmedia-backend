import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser } from 'database/schema/user';
import { LoginDTO } from './dto/login.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUser(@Req() req: any) {
    const userId = req.user?.userId
    return this.userService.getUser(userId)
  }

  @Post('/')
  async createUser(@Body() userDetails: IUser) {
    return await this.userService.createUser(userDetails)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/")
  async updateUser(@Req() req: any, @Body() userDetails: IUser) {
    const userId = req.user?.userId
    return await this.userService.updateUser(userId, userDetails)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/")
  async deleteUser(@Req() req: any) {
    const userId = req.user?.userId
    return await this.userService.deleteUser(userId)
  }

  @Get('/testttttttt')
  async testttttttt(@Req() req: any) {
    return { data: {} }
  }

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    return this.userService.login(body.email, body.password)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updatePassword')
  async updatePassword(@Body() passwordDetails: UpdatePasswordDTO, @Req() req: any) {
    const userId = req.user?.userId;
    return await this.userService.updatePassword(passwordDetails, userId);
  }

  @Get('/verifyEmail/:emilAddress')
  async verifyEmail(@Req() req: any, @Param('emilAddress') emilAddress: string) {
    return this.userService.verifyEmailAddress(emilAddress)
  }

  @Put('/forgotPassword')
  async forgotPassword(@Body() body: LoginDTO) {
    return await this.userService.forgotPassword(body.email, body.password);
  }


  @UseGuards(JwtAuthGuard)
  @Post('/uploadProfilePic')
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
  async uploadProfilePic(@Req() req: any, @UploadedFile() file: Express.Multer.File,) {
    const userId = req.user?.userId;
    return await this.userService.uploadProfilePic(userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/feed')
  async feed(@Req() req: any) {
    const userId = req.user?.userId;
    return await this.userService.feed(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/createConnection/:userEmailAddress')
  async createConnection(@Req() req: any, @Param('userEmailAddress') userEmailAddress: string) {
    const userId = req.user?.userId;
    return await this.userService.createConnection(userId, userEmailAddress);
  }
}

