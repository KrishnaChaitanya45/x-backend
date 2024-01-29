import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BasePostgresDBService } from 'y/common';
import * as argon from 'argon2';
import * as bcrypt from 'bcrypt';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';

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
  async uploadImage(image: any) {
    try {
      const bufferData = Buffer.from(image.buffer.data);
      const uploadedImage = (await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

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
}
