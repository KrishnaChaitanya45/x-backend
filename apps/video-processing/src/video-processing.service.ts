import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { convertVideoFormat } from './utils/ffmpeg_video_format_converter';
import { RedisRepository, UtilsService } from 'y/common';
@Injectable()
export class VideoProcessingService {
  constructor(
    private readonly utils: UtilsService,
    private readonly redis: RedisRepository,
  ) {}
  async processVideo(
    video: Express.Multer.File,
    format: string,
    videoName: string,
    @Res() res: Response,
  ): Promise<
    Response<{
      message: string;
      processId: string;
    }>
  > {
    //! INITIAL APPROACH
    //? accept multiple videos formats to a single format
    //? convert video into different resolutions
    //? store them into the directory and save it to the cloudinary
    //? create a directory in the cloudinary and store the videos

    //* ACCEPT MULTIPLE VIDEO FORMATS AND CONVERT THEM TO A SINGLE FORMAT
    //? --> store the converted video inside a directory with the name COURSE_NAME_RAW.mp4
    //? create a directory if it does not exist
    // await fs.mkdir(__dirname + 'videos', { recursive: true });
    // Mark the end of the stream
    // Convert the video stream to the specified format
    try {
      const generateUniqueVideoName = videoName + Date.now().toString();
      const result = await convertVideoFormat(
        video,
        format,
        videoName,
        generateUniqueVideoName,
        this.redis,
        this.utils,
      );
      console.log('RESULT' + JSON.stringify(result));
      return res.status(200).json({
        message: 'Video conversion in progress',
        processId: generateUniqueVideoName,
      });
    } catch (error) {
      console.log('ERROR OCCURED', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }

  async getProgress(videoId: string, @Res() res: Response) {
    try {
      const progress = await this.redis.get('video-processing', videoId);
      return res.json({
        progress,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Error getting progress',
      });
    }
  }
}
