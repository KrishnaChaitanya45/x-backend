import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'apps/auth/utils/utils.service';
import { BasePostgresDBService, CreateCommunity } from 'y/common';
@Injectable()
export class DashboardAndNetworkService {
  constructor(
    private prisma: BasePostgresDBService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async createCommunity(body: CreateCommunity) {
    try {
      const { name, description, moderators, unique_name } = body;
      if (!name || !description || !moderators || !unique_name) {
        throw new Error('Missing required fields');
      }
      const community = await this.prisma.community.create({
        data: {
          name,
          description,
          bg_image:
            'https://res.cloudinary.com/dx0hz2ziy/image/upload/v1627667939/communities/placeholder-community-bg-image.jpg',
          unique_name,
          members: {
            connect: moderators.map((moderator) => ({ id: moderator })),
          },
        },
      });

      console.log('CREATED COMMUNITY SUCCESSFULLY', community);
      return {
        success: true,
        community,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getCommunities() {
    try {
      const communities = await this.prisma.community.findMany({
        include: {
          members: true,
        },
      });
      return {
        success: true,
        communities,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createCourse(body: any) {
    return {
      success: true,
      body,
    };
  }
}
