import { Module } from '@nestjs/common';
import { AccessControlService } from './services/access-control.service';

@Module({
  providers: [AccessControlService]
})
export class AccessControlModule {}
