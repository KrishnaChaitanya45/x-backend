import { Injectable, Res } from '@nestjs/common';
import { CreatedUserDto, CreateUserInputDTO } from '../dto/create-user.dto';
import * as argon from 'argon2';
import { v2 } from 'cloudinary';
const streamifier = require('streamifier');
import { BasePostgresDBService } from 'y/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { loginUserDTO } from '../dto/login-user.dto';
import { UtilsService } from '../utils/utils.service';
import { CreateProfileDTO } from '../dto/create-user-profile.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: BasePostgresDBService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
  ) {}
  async register(body: any) {
    try {
      const hashedPassword = await this.utilsService.hashData(body.password);
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });
      if (findUser) {
        throw new ForbiddenException('USER ALREADY EXISTS');
      }
      const newUser = await this.prisma.user.create({
        data: { ...body, password: hashedPassword },
      });
      const tokens = await this.utilsService.getTokens(
        newUser.id,
        newUser.email,
      );
      await this.utilsService.updateRefreshTokenHash(
        newUser.id,
        tokens.refreshToken,
      );

      return {
        success: true,
        user: newUser,
        tokens,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }
  async login(createUserDto: loginUserDTO) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      });
      console.log('USER', user);
      if (!user) {
        return {
          success: false,
          error: 'USER NOT FOUND',
        };
      }
      const isPasswordValid = await bcrypt.compare(
        createUserDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'INVALID PASSWORD',
        };
      }
      const tokens = await this.utilsService.getTokens(user.id, user.email);
      await this.utilsService.updateRefreshTokenHash(
        user.id,
        tokens.refreshToken,
      );

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  async findAllUsers() {
    return await this.prisma.user.findMany();
  }
  async uploadProfilePhoto(file: Express.Multer.File, userId: string) {
    try {
      const uploadedImage = await this.utilsService.uploadImage(file);
      if (!uploadedImage.success) {
        throw new Error(uploadedImage.message);
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          //@ts-ignore
          profilePhoto: uploadedImage.imageURL,
        },
      });
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  async createUserProfile(body: CreateProfileDTO, userId: string) {
    try {
      const {
        education,
        first_name,
        interests,
        last_name,
        location,
        socials,
        achievements,
        // skills,
        work_experience,
      } = body;
      const updateUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          first_name,
          last_name,
          //@ts-ignore
          // skills: skills,
          education,
          achievements,
          work_experience,
          interests,
          location,
          socials,
        },
      });
      return {
        success: true,
        user: updateUser,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error,
      };
    }
  }
}
