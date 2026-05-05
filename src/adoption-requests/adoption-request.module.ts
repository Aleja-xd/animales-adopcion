import { AdoptionRequest } from './entities/adoption-request.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { AdoptionRequestService } from './adoption-request.service';
import { AdoptionRequestController } from './adoption-request.controller';

@Module({
  imports: [
    // Registra Animal + las entities de las FKs
    TypeOrmModule.forFeature([AdoptionRequest, Location, User]),
  ],
  controllers: [AdoptionRequestController],
  providers: [AdoptionRequestService],
})
export class AdoptionRequestsModule {}