import { Controller, Get, Req, Res } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { Request, Response } from 'express';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller('/streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @MessagePattern('UPLOAD_VIDEO')
  async getHello(@Ctx() ctx: RmqContext) {
    const video = JSON.parse(ctx.getMessage().content.toString());
    return await this.streamingService.uploadVideo(video);
  }

  @Get('/')
  async streamVideo(@Req() req: Request, @Res() res: Response) {
    return await this.streamingService.streamVideo(req, res);
  }
}
