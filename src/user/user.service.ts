import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel, IUser } from 'database/schema/user';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { IPost, PostModel } from 'database/schema/post';
import { ConnectionModel, IConnection } from 'database/schema/userConnection';
import { Connection } from 'mongoose';


@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) { }

  async getUser(userId: string) {
    try {
      const user: IUser = await UserModel.findOne({ _id: userId }, { _id: 0, "__v": 0, "createdAt": 0, "updatedAt": 0, "password": 0 })

      if (!user) {
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', },
          HttpStatus.NOT_FOUND
        );
      }

      user.profilePic = process.env.INSTANCE_URL + 'uploads/' + user.profilePic

      user.contacts = 246
      user.birthDate = "12-02-1985"
      if (user.isActive)
        return { data: user, "message": "User data retrieve", statusCode: HttpStatus.OK }
      else
        return { user: {}, "message": "Inactive user", statusCode: HttpStatus.OK }


    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createUser(userDetails: IUser) {
    try {

      if (!userDetails.name)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Name', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.email)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Email', },
          HttpStatus.BAD_REQUEST
        );

      if (!userDetails.password)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Password', },
          HttpStatus.BAD_REQUEST
        );


      const checkUser: IUser = await UserModel.findOne({ "email": userDetails.email })

      if (checkUser)
        throw new HttpException(
          { statusCode: HttpStatus.BAD_REQUEST, message: `Email Address or Mobile Number already registered !`, },
          HttpStatus.BAD_REQUEST
        );

      userDetails.profilePic = "default.png"
      userDetails.isActive = true
      userDetails.birthDate = "01-01-2024"
      const newUser = new UserModel(userDetails);
      const user = await newUser.save()

      const payload = { username: userDetails.name, sub: user._id.toString() };
      const accessToken = this.jwtService.sign(payload)

      return {
        statusCode: HttpStatus.OK,
        message: "User created successfully",
        data: { accessToken: accessToken }
      };
    }
    catch (error) {

      if (error instanceof HttpException)
        throw error;

      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(emailAddress: string, password: string) {
    try {

      if (!emailAddress)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Email', }, HttpStatus.BAD_REQUEST);

      if (!password)
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a Password', }, HttpStatus.BAD_REQUEST);

      const user: IUser = await UserModel.findOne({ email: emailAddress, password: password });

      if (!user) {
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'User log in failed', }, HttpStatus.BAD_REQUEST);
      }

      if (user.isActive) {
        const token = this.jwtService.sign({ sub: user._id, username: user.name });
        return { "data": { accessToken: token }, "message": "User log in successfully", statusCode: HttpStatus.OK };
      }
      else
        throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'User not have active session', }, HttpStatus.BAD_REQUEST);

    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(userId: string) {
    try {
      const user: IUser = await UserModel.findOne({ _id: userId });
      if (!user)
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'No user is available for the provided ID', }, HttpStatus.NOT_FOUND);
      user.isActive = false
      await user.save()
      return { "data": {}, "message": "User deleted successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      return { "data": error, "message": "Error in update user", statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
    }
  }

  async updateUser(userId: string, userDetail: IUser) {
    try {
      const user: IUser = await UserModel.findOne({ _id: userId, "isActive": true });
      if (!user)
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'No user is available for the provided ID', }, HttpStatus.NOT_FOUND);

      Object.assign(user, userDetail)
      const updated = await user.save()
      return { "data": user, "message": "User updated successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      return { "data": error, "message": "Error in update user", statusCode: HttpStatus.INTERNAL_SERVER_ERROR }
    }
  }

  async updatePassword(passwordDetails: UpdatePasswordDTO, userId: string) {
    try {

      if (!userId) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid User ID', }, HttpStatus.BAD_REQUEST,);

      const user: IUser = await UserModel.findOne({ "_id": userId })

      if (!user) throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', }, HttpStatus.NOT_FOUND,);

      if (!passwordDetails.currentPassword) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Current Password', }, HttpStatus.BAD_REQUEST,);

      if (!passwordDetails.password) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Password', }, HttpStatus.BAD_REQUEST,);

      if (!passwordDetails.confirmPassword) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'The request is missing a parameter Confirm Password', }, HttpStatus.BAD_REQUEST,);

      if (user.password != passwordDetails.currentPassword) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Current password is incorrect. Please try again.' }, HttpStatus.BAD_REQUEST);

      if (passwordDetails.confirmPassword != passwordDetails.password) throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Passwords do not align. Please re-enter and confirm.' }, HttpStatus.BAD_REQUEST)

      user.password = passwordDetails.password;
      await user.save();

      return { message: 'Password updated successfully', statusCode: HttpStatus.OK }
    }
    catch (error) {

      if (error instanceof HttpException)
        throw error;

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred: ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyEmailAddress(emailAddress: string) {
    try {
      const user: IUser = await UserModel.findOne({ "email": emailAddress })
      if (!user) throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', }, HttpStatus.NOT_FOUND);

      if (user.isActive)
        return { data: { "status": true }, message: "Email address verified", statusCode: HttpStatus.OK }
      else
        return { data: { "status": false }, message: "User not have active session", statusCode: HttpStatus.FORBIDDEN }

    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred: ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(emailAddress: string, password: string) {
    try {
      const user: IUser = await UserModel.findOne({ "email": emailAddress })
      if (!user) throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', }, HttpStatus.NOT_FOUND);

      if (user.isActive) {
        user.password = password
        user.save()
        return { data: {}, message: "Password updated", statusCode: HttpStatus.OK }
      }
      else
        return { data: { "status": false }, message: "User not have active session", statusCode: HttpStatus.FORBIDDEN }

    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred: ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    try {

      const user: IUser = await UserModel.findOne({ "_id": userId, isActive: true })

      if (!user) throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found, Upload Failed !', }, HttpStatus.NOT_FOUND);

      user.profilePic = file.filename;

      user.save()
      return { data: { "profilePic": file.filename }, message: "Profile Pic uploaded successfully", statusCode: HttpStatus.OK }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred: ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async feed(userId: string) {
    try {
      const userFeed: IPost[] = await PostModel.find({}).skip(0).limit(10).sort({ createdAt: -1 })

      // ser.profilePic = process.env.INSTANCE_URL + 'uploads/' + user.profilePic
      userFeed.map(ele => {
        ele.media = process.env.INSTANCE_URL + 'uploads/' + ele.media
      })
      return userFeed;
    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred: ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createConnection(userId: string, friendEmail: string) {
    try {
      const connection: IConnection = new ConnectionModel()

      connection.userId = userId;

      const user: IUser = await UserModel.findOne({ "email": friendEmail })

      if (!user) {
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'User Not Found', },
          HttpStatus.NOT_FOUND
        );
      }

      connection.friendId = user._id
      connection.isActive = true;
      connection.save()
      return { "data": {}, "message": "User connection created", statusCode: HttpStatus.OK }
    }
    catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An unexpected error occurred: ' + error.message, }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
