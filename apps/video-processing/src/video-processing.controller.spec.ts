import { Test, TestingModule } from '@nestjs/testing';
import { VideoProcessingController } from './video-processing.controller';
import { VideoProcessingService } from './video-processing.service';

describe('VideoProcessingController', () => {
  let videoProcessingController: VideoProcessingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VideoProcessingController],
      providers: [VideoProcessingService],
    }).compile();

    videoProcessingController = app.get<VideoProcessingController>(VideoProcessingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(videoProcessingController.getHello()).toBe('Hello World!');
    });
  });
});
