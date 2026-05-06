import { AdoptionRequest } from './entities/adoption-request.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';

import { Animal } from '../animals/entities/animal.entity';
import { AdoptionRequestService } from './adoption-request.service';
import { AdoptionRequestController } from './adoption-request.controller';

@Module({
  imports: [
    // Registra Animal + las entities de las FKs
    TypeOrmModule.forFeature([AdoptionRequest, Location, User, Animal]),
  ],
  controllers: [AdoptionRequestController],
  providers: [AdoptionRequestService],
  exports: [AdoptionRequestService],
})
export class AdoptionRequestsModule {}
