import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP } from './constants/kafka.constants';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';
@Module({})
export class KafkaModule {
  static register(consumerGroup: string): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: KAFKA_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: KAFKA_CLIENT_ID,
                brokers: [KAFKA_BROKERS],
              },
              consumer: {
                groupId: consumerGroup ?? KAFKA_CONSUMER_GROUP,
              },
          },
        }
        ]
      ),
      ],
      exports: [ClientsModule],
    };
  }
}