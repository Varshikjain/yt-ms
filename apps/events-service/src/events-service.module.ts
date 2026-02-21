import { Module } from '@nestjs/common';
import { EventsServiceController } from './events-service.controller';
import { EventsServiceService } from './events-service.service';
import { DatabaseModule } from '@app/database/database.module';
import { KafkaModule } from '@app/kafka';

@Module({
  imports: [KafkaModule.register('events-service-group'), DatabaseModule],
  controllers: [EventsServiceController],
  providers: [EventsServiceService],
})
export class EventsServiceModule {}
