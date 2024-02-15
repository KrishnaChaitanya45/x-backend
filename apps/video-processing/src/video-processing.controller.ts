import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoProcessingService } from './video-processing.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('/api/v1/video-processing/')
export class VideoProcessingController {
  constructor(
    private readonly videoProcessingService: VideoProcessingService,
  ) {}

  @Post('/upload')
  // @UseGuards(InstructorGuards)
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideoWithProcessing(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { format: string; videoName: string },
    @Res() res: Response,
  ) {
    return this.videoProcessingService.processVideo(
      file,
      body.format,
      body.videoName,
      res,
    );
  }

  @Get('/progress/:videoId')
  async getProgress(@Param() param: { videoId: string }, @Res() res: Response) {
    return this.videoProcessingService.getProgress(param.videoId, res);
  }
}
