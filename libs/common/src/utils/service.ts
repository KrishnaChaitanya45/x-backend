import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BasePostgresDBService, RedisRepository } from 'y/common';
import * as argon from 'argon2';
import * as bcrypt from 'bcrypt';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
import { readdir } from 'fs/promises';
import { DecodedUserObject } from 'libs/common/types/user/DECODED_USER';

@Injectable()
export class UtilsService {
  constructor(
    private readonly prisma: BasePostgresDBService,
    private readonly jwtService: JwtService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret:
            'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
          expiresIn: 60 * 60 * 24 * 1,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret:
            'fd8f1e9a31e4c7d100b3af4ee01fcd148539b71cd23b3ebab87f096fb6df766d5f34f2aa8efbfc8639cedee8080df7a0110c7de47f1c31124dd67b56592e49e6',
          expiresIn: 60 * 60 * 24 * 30,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
    isInstructor = false,
  ) {
    const hash = await argon.hash(refreshToken);
    if (isInstructor) {
      await this.prisma.instructors.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: hash,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hash },
      });
    }
  }
  async uploadImage(image: any, file_name: string, folder_name: string) {
    try {
      const bufferData = Buffer.from(image.buffer.data);
      const uploadedImage = (await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: folder_name,
            public_id: file_name,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        const readableStream = new Readable(); // Import 'Readable' if necessary
        readableStream.push(bufferData);
        readableStream.push(null); // Signals the end of the stream

        readableStream.pipe(upload);
      })) as any;
      console.log(uploadedImage);
      return {
        message: 'upload successful',
        success: true,
        imageURL: uploadedImage.secure_url,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'upload failed',
        success: false,
      };
    }
  }

  async checkIsInstructor(instructor_id: string) {
    try {
      const instructor = await this.prisma.instructors.findUnique({
        where: {
          id: instructor_id,
        },
      });

      if (!instructor) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async validUser(user_id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyAccessToken(
    accessToken: string,
  ): Promise<DecodedUserObject | null> {
    try {
      const user = await this.jwtService.verifyAsync(accessToken, {
        secret:
          'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
      });

      user.userId = user.sub;
      delete user.sub;
      return user;
    } catch (error) {
      return null;
    }
  }

  async uploadProcessedVideo(
    processId?: string,
    dirName?: string,
    redis?: RedisRepository,
    updateProgress?: (
      message: string,
      redis: RedisRepository,
      videoId: string,
    ) => void,
  ): Promise<{
    success: boolean;
    message: string;
    url?: string;
  }> {
    // TODO
    //? --> Fetch the files from the processed_video directory
    //? --> Upload the files to the cloud storage
    //? --> Return the uploaded file URL
    //? --> The files should be deleted after successful upload

    try {
      updateProgress(
        'Started Reading Directory For Uploading Files',
        redis,
        processId,
      );
      const directoryData = await readdir(dirName);
      console.log('Directory Data', directoryData);

      updateProgress('Uploading Files To Cloud Storage', redis, processId);
      for (const file of directoryData) {
        updateProgress(
          `Uploading ${directoryData.indexOf(file) + 1} files out of ${
            directoryData.length
          }`,
          redis,
          processId,
        );
        (await new Promise((resolve, reject) => {
          const upload = v2.uploader.upload(
            `processed_videos/${file}`,
            {
              resource_type: 'raw',
              folder: processId,
              public_id: file,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
        })) as UploadApiResponse | UploadApiErrorResponse;
        console.log(
          `UPLOADED ${directoryData.indexOf(file) + 1} FILES OUT OF ${
            directoryData.length
          }`,
        );
        updateProgress(
          `UPLOADED ${directoryData.indexOf(file) + 1} FILES OUT OF ${
            directoryData.length
          }`,
          redis,
          processId,
        );
      }
      console.log('UPLOADED ALL FILES');
      updateProgress(`Video Uploaded Successfully`, redis, processId);
      return {
        success: true,
        message: 'Video uploaded successful',
      };
    } catch (error) {
      updateProgress(`Video Uploading Failed`, redis, processId);
      console.log('ERROR' + JSON.stringify(error));
      return {
        success: false,
        message: 'Video processing failed',
      };
    }
  }

  async uploadRawVideo() {
    //TODO
    //? --> Upload the raw video to the cloud storage
    //? --> Return the uploaded file URL
    try {
      const uploadedVideo = (await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder: 'raw_videos',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        const readableStream = new Readable(); // Import 'Readable' if necessary
        readableStream.push('video.mp4');
        readableStream.push(null); // Signals the end of the stream

        readableStream.pipe(upload);
      })) as any;
      console.log(uploadedVideo);
    } catch (error) {
      console.log('ERROR' + JSON.stringify(error));
    }
  }
}
