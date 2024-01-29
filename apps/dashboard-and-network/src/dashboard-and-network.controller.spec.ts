import { Test, TestingModule } from '@nestjs/testing';
import { DashboardAndNetworkController } from './dashboard-and-network.controller';
import { DashboardAndNetworkService } from './dashboard-and-network.service';

describe('DashboardAndNetworkController', () => {
  let dashboardAndNetworkController: DashboardAndNetworkController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DashboardAndNetworkController],
      providers: [DashboardAndNetworkService],
    }).compile();

    dashboardAndNetworkController = app.get<DashboardAndNetworkController>(
      DashboardAndNetworkController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dashboardAndNetworkController.getHello()).toBe('Hello World!');
    });
  });
});
