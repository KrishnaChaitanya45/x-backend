import { Injectable, Res } from '@nestjs/common';
import { BasePostgresDBService } from 'y/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { loginUserDTO } from '../dto/login-user.dto';
import { UtilsService } from '../utils/utils.service';
import { CreateProfileDTO } from '../dto/create-user-profile.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: BasePostgresDBService,
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
        false,
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

  async registerInstructor(body: any) {
    try {
      const hashedPassword = await this.utilsService.hashData(body.password);
      const findUser = await this.prisma.instructors.findFirst({
        where: {
          email: body.email,
        },
      });
      if (findUser) {
        throw new ForbiddenException('USER ALREADY EXISTS');
      }
      let newUser = await this.prisma.instructors.create({
        data: { ...body, password: hashedPassword, verified: false },
      });
      const verificationRequest = await this.prisma.verificationRequests.create(
        {
          data: {
            instructor_id: newUser.id,
            verified: false,
            requested_on: new Date().toISOString(),
            expires_on: new Date(
              new Date().setTime(new Date().getTime() + 1680 * 60 * 60 * 1000),
            ).toISOString(),
          },
        },
      );
      console.log(' VERIFICATION REQUEST CREATED ', verificationRequest);
      newUser = await this.prisma.instructors.update({
        where: {
          id: newUser.id,
        },
        data: {
          verificationId: verificationRequest.request_id,
        },
      });

      const tokens = await this.utilsService.getTokens(
        newUser.id,
        newUser.email,
      );
      await this.utilsService.updateRefreshTokenHash(
        newUser.id,
        tokens.refreshToken,
        true,
      );
      console.log(' NEW USER DATA UPDATED ', newUser);

      return {
        success: true,
        user: newUser,
        tokens,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response,
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
        false,
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

  async loginInstructor(body: any) {
    try {
      const instructors = await this.prisma.instructors.findMany();
      console.log('INSTRUCTORS', instructors);
      const instructor = await this.prisma.instructors.findFirst({
        where: {
          email: body.email,
        },
      });
      console.log('USER', instructor);
      if (!instructor) {
        return {
          success: false,
          error: 'USER NOT FOUND',
        };
      }
      const isPasswordValid = await bcrypt.compare(
        body.password,
        instructor.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'INVALID PASSWORD',
        };
      }
      const tokens = await this.utilsService.getTokens(
        instructor.id,
        instructor.email,
      );
      await this.utilsService.updateRefreshTokenHash(
        instructor.id,
        tokens.refreshToken,
        true,
      );

      return {
        success: true,
        user: instructor,
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
        skills,
        work_experience,
      } = body;
      const updateUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          first_name,
          last_name,
          //@ts-expect-error skills are not defined for now
          skills: skills,
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
