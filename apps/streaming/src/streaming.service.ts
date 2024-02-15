import { Injectable, Req, Res } from '@nestjs/common';
import { v2 } from 'cloudinary';
import axios from 'axios';
import { Readable } from 'stream';
import { Request, Response } from 'express';
@Injectable()
export class StreamingService {
  async uploadVideo(video: any) {
    try {
      const bufferData = Buffer.from(video.data.buffer.data);
      console.log(':REACHED HERE,', bufferData);
      const uploadedImage = (await new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          { resource_type: 'video' },
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
      return {
        success: true,
        videoURL: uploadedImage.secure_url,
      };
    } catch (error) {
      console.log('REACHED HERE ERROR', error);
      return {
        success: false,
        error: error,
      };
    }
  }
  async streamVideo(@Req() req: Request, @Res() res: Response) {
    try {
      const fileUrl =
        'https://res.cloudinary.com/ddnov4rnh/video/upload/v1702390116/qo8hfjvzhpogtqfrbewv.mp4';
      const headResponse = await axios.head(fileUrl);
      const headers = headResponse.headers;

      const contentLength = parseInt(headers['content-length']);

      const start = 0;
      const end = contentLength - 1;

      const videoResponse = await axios.get(fileUrl, {
        headers: {
          range: `bytes=${start}-${end}`,
          connection: 'keep-alive',
        },
        responseType: 'stream',
      });

      const videoStream = videoResponse.data as Readable;

      const customHeaders = {
        'Content-Range': `bytes ${start}-${end}/${contentLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, customHeaders);
      videoStream.pipe(res);
    } catch (error) {
      console.error('Error while streaming video:', error);
      throw new Error('Error streaming video');
    }
  }
}
