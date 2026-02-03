import { DatabaseService, users } from '@app/database';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { Inject, Injectable, OnModuleInit, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { timestamp } from 'rxjs';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService :DatabaseService,
    private readonly jwtService : JwtService,
  ) {}

  async onModuleInit() {
    //connect to kafka when module is initialized
    await this.kafkaClient.connect();
  }

  async register(email:string, password:string, name:string){

    const existingUser = await this.dbService.db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if(existingUser.length > 0){
      throw new ConflictException('User with this email already exists');
    }

    //Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);

     const [newUser] = await this.dbService.db.insert(users).values({
      email,
      password: hashedPassword,
      name,
     }).returning();

     //send user registered event to kafka
      this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
        userId: newUser.id,
        email: newUser.email,
        timestamp: Date.now(),
      });

     return {
      message: 'User registered successfully',
      userId: newUser.id
     };
  }

  async login(email:string, password:string){
    const [user] =await this.dbService.db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if(!user || !(await bcrypt.compare(password, user.password))){
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, {
      userId: user.id,
      timestamp: Date.now(),
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role : user.role,
      }
    };
  }

  async getProfile(userId:string){
    const [user] = await this.dbService.db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

    if(!user){
      throw new UnauthorizedException('User not found');
    }

    return user;
  }


}
