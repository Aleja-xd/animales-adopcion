import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdoptionRequest, AdoptionStatus } from './entities/adoption-request.entity';
import { User } from '../users/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';

import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';

@Injectable()
export class AdoptionRequestService {
  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly adoptionRepo: Repository<AdoptionRequest>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
  ) {}

  async create(dto: CreateAdoptionRequestDto) {
    const { userId, animalId, message } = dto;

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const animal = await this.animalRepo.findOne({
      where: { id: animalId },
    });
    if (!animal) {
      throw new NotFoundException('Animal no encontrado');
    }

    const existing = await this.adoptionRepo.findOne({
      where: {
        user: { id: userId },
        animal: { id: animalId },
      },
      relations: ['user', 'animal'],
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe una solicitud para este animal',
      );
    }

    const adoptionRequest = this.adoptionRepo.create({
      user,
      animal,
      message,
      status: AdoptionStatus.PENDING,
    });

    return this.adoptionRepo.save(adoptionRequest);
  }

  findAll() {
    return this.adoptionRepo.find({
      relations: ['user', 'animal'],
    });
  }

  async findOne(id: string) {
    const request = await this.adoptionRepo.findOne({
      where: { id },
      relations: ['user', 'animal'],
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return request;
  }

  async remove(id: string) {
    const request = await this.findOne(id);
    return this.adoptionRepo.remove(request);
  }
}