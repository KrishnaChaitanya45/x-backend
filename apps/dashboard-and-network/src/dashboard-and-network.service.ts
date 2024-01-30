import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilsService } from 'y/common';
import { BasePostgresDBService, CreateCommunity } from 'y/common';
import { CREATE_COURSE_DTO } from '../dto/Course.dto';
import { CREATE_MODULE } from 'libs/common/types/course/CREATE_MODULE';
import { COURSE_CONTENT } from 'libs/common/types/course/CREATE_COURSE_CONTENT';
@Injectable()
export class DashboardAndNetworkService {
  constructor(private prisma: BasePostgresDBService) {}
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

  async createCourse(body: CREATE_COURSE_DTO, user: string) {
    try {
      const {
        name,
        description,
        cost,
        unique_name,
        instructor,
        tags,
        rewards,
        level,
        icon,
        bg_image,
        skills,
      } = body;

      if (
        !name ||
        !description ||
        !cost ||
        !unique_name ||
        !instructor ||
        !tags ||
        !rewards ||
        !level ||
        !skills
      ) {
        throw new Error('Missing required fields');
      }
      instructor.push(user);
      const course = await this.prisma.course.create({
        data: {
          name,
          description,
          cost,
          unique_name,
          instructor: {
            connect: instructor.map((instructor) => ({ id: instructor })),
          },

          tags,
          rewards: {
            connect: rewards.map((reward) => ({ id: reward })),
          },
          level,
          icon,
          bg_image,
          skills: {
            connect: skills.map((skill) => ({ id: skill })),
          },
        },
      });

      return {
        success: true,
        course,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }

  async getCoursesOfInstructor(instructor_id: string) {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          instructor: {
            some: {
              id: instructor_id,
            },
          },
        },
        include: {
          instructor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profilePhoto: true,
              user_name: true,

              password: false,
            },
          },
        },
      });
      return {
        success: true,
        courses,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }

  async getSingleCourse(course_id: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: {
          id: course_id,
        },
        include: {
          instructor: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profilePhoto: true,
              user_name: true,

              password: false,
            },
          },
          modules: true,
        },
      });
      return {
        success: true,
        course,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async addModule(body: CREATE_MODULE, course_id: string) {
    try {
      const {
        title,
        rewards,
        description,
        level,
        tags,
        unique_name,
        topics,
        icon,
        bg_image,
      } = body;
      if (
        !title ||
        !rewards ||
        !description ||
        !level ||
        !tags ||
        !unique_name ||
        !topics
      ) {
        throw new Error('Missing required fields');
      }
      const course = await this.prisma.course.findUnique({
        where: {
          id: course_id,
        },
      });
      if (!course) {
        throw new Error('Course not found');
      }
      const module = await this.prisma.module.create({
        data: {
          title,
          rewards,
          description,
          level,
          tags,
          unique_name,
          topics,
          icon,
          bg_image,
          course: {
            connect: {
              id: course_id,
            },
          },
        },
      });
      return {
        success: true,
        module,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }

  async addCourseContent(body: COURSE_CONTENT, module_id: string) {
    try {
      const {
        title,
        description,
        rewards,
        level,
        video_link,
        unique_name,
        tags,
        icon,
        bg_image,
        challenges,
      } = body;
      if (
        !title ||
        !description ||
        !rewards ||
        !level ||
        !video_link ||
        !unique_name ||
        !tags ||
        !challenges
      ) {
        throw new Error('Missing required fields');
      }
      const module = await this.prisma.module.findUnique({
        where: {
          id: module_id,
        },
      });
      if (!module) {
        throw new Error('Module not found');
      }
      const content = await this.prisma.courseContent.create({
        data: {
          title,
          description,
          rewards,
          level,
          video_link,
          unique_name,
          tags,
          icon,
          bg_image,
          challenges,
          module_id,
        },
      });
      return {
        success: true,
        content,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }
}
