import { Injectable, Inject } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG') private config: { port: string },
  ) {}

  getHello(): string {
    return `Hello World! ${this.devConfigService.getDBHOST()}, port=${this.config.port}`;
  }
}
