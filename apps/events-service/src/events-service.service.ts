import { CreateEventDto, UpdateEventDto } from '@app/common';
import { DatabaseService } from '@app/database/database.service';
import { events } from '@app/database/schema/events';
import { KAFKA_TOPICS } from '@app/kafka';
import { ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';

@Injectable()
export class EventsServiceService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly dbService :DatabaseService,
  ) {}

  async onModuleInit() {
    //connect to kafka when module is initialized
    await this.kafkaClient.connect();
  }

  async create(CreateEventDto: CreateEventDto, organizerId: string) {
    const [event] = await this.dbService.db.insert(events).values({
      ...CreateEventDto,
      date: new Date(CreateEventDto.date),
      price: CreateEventDto.price || 0,
      organizerId,
    }).returning();

    //send event created event to kafka
    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED, {
      eventId: event.id,
      organizerId: event.organizerId,
      title: event.title,
      timestamp: new Date().toISOString(),
    });
  }

  async findAll() {
    return this.dbService.db.select().from(events)
    .where(eq(events.status, 'PUBLISHED'));
  }

  async findOne(id: string) {
    const [event] = await this.dbService.db.select().from(events)
    .where(eq(events.id, id))
    .limit(1);

    if(!event){
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: string, UpdateEventDto: UpdateEventDto, userId: string, userRole: string) {

    const event = await this.findOne(id);

    if(event.organizerId !== userId && userRole !== 'admin'){
      throw new ForbiddenException(`You are not allowed to update this event`);
    }

    const updatedData: Record<string, any> = {...UpdateEventDto};
    if(UpdateEventDto.date){
      updatedData.date = new Date(UpdateEventDto.date);
    }

    updatedData.updatedAt = new Date();

    const [updated] = await this.dbService.db.update(events)
    .set(updatedData)
    .where(eq(events.id, id))
    .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED, {
      eventId: updated.id,
      changes: Object.keys(UpdateEventDto),
      timestamp: new Date().toISOString(),
    });
    
    return updated;
  }

  async publish(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);

    if(event.organizerId !== userId && userRole !== 'admin'){
      throw new ForbiddenException(`You are not allowed to publish this event`);
    }

    const [publish] = await this.dbService.db.update(events)
    .set({ status: 'PUBLISHED', updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

    return publish;
  }

  async cancel(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);

    if(event.organizerId !== userId && userRole !== 'admin'){
      throw new ForbiddenException(`You are not allowed to cancel this event`);
    }

    const [cancelled] = await this.dbService.db.update(events)
    .set({ status: 'CANCELLED', updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CANCELLED, {
      eventId: cancelled.id,
      organizerId: cancelled.organizerId,
      timestamp: new Date().toISOString(),
    });

    return cancelled;
  }

  async findMyEvent(organizerId: string) {
    return this.dbService.db.select().from(events)
    .where(eq(events.organizerId, organizerId));
  }

  
}
