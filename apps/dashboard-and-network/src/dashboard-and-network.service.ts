import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardAndNetworkService {
  getHello(): string {
    return 'Hello World!';
  }
}
