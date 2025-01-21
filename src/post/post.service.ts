import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel, IUser } from 'database/schema/user';
import { IPost, PostModel } from 'database/schema/post';
import path from 'path';


@Injectable()
export class PostService {

  async getUserPost(userId: string) {
    try {
      const post: IPost[] = await PostModel.find({ userId: userId });
      post.map(ele => {
        ele.media = process.env.INSTANCE_URL + 'uploads/' + ele.media
      })



      return { data: post, message: "User post fined", statusCode: HttpStatus.OK }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPost(userId: string, body: any, file: Express.Multer.File) {
    try {

      const { fileName, fileSize, caption } = body;

      if (!caption)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a title', }, HttpStatus.BAD_REQUEST);

      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];
      const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'mpeg', '3gp'];

      const filename = file.filename
      const fileExtension = fileName.split('.').pop().toLowerCase();

      let type = ""
      if (imageExtensions.includes(fileExtension)) {
        type = 'image';
      } else {
        type = 'video';
      }

      const postDetails: IPost = new PostModel()
      postDetails.caption = caption
      postDetails.userId = userId;
      postDetails.media = filename;
      postDetails.type = type
      postDetails.isActive = true;


      postDetails.save()
      return { data: {}, message: "User post Created", statusCode: HttpStatus.OK }

    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}