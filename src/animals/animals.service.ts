import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Animal } from './entities/animal.entity';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AnimalsService {
  private readonly logger = new Logger('AnimalsService');

  constructor(
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    private readonly cloudinaryService: CloudinaryService,

    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAnimalDto) {
    const { locationId, registeredById, ...rest } = dto;

    let location: Location | null = null;
    if (locationId) {
      location = await this.locationRepo.findOne({
        where: { id: locationId },
      });
      if (!location) {
        throw new NotFoundException(`Location ${locationId} no encontrada`);
      }
    }

    let registeredBy: User | null = null;
    if (registeredById) {
      registeredBy = await this.userRepo.findOne({
        where: { id: registeredById },
      });
      if (!registeredBy) {
        throw new NotFoundException(`User ${registeredById} no encontrado`);
      }
    }

    try {
      const animal = this.animalRepo.create({
        ...rest,
        location: location ?? undefined,
        registeredBy: registeredBy ?? undefined,
      });

      return await this.animalRepo.save(animal);
    } catch (err) {
      this.handleError(err);
    }
  }

  async findAll() {
    return this.animalRepo.find({
      relations: ['registeredBy'], // consistente
    });
  }

  async findOne(id: string) {
    const animal = await this.animalRepo.findOne({
      where: { id },
      relations: ['registeredBy', 'interestedUsers'],
    });

    if (!animal) {
      throw new NotFoundException(`Animal ${id} no encontrado`);
    }

    return animal;
  }

  async update(id: string, dto: UpdateAnimalDto) {
    const animal = await this.findOne(id);

    const { locationId, registeredById, ...rest } = dto;

    if (locationId) {
      const location = await this.locationRepo.findOne({
        where: { id: locationId },
      });
      if (!location) {
        throw new NotFoundException(`Location ${locationId} no encontrada`);
      }
      animal.location = location;
    }

    if (registeredById) {
      const user = await this.userRepo.findOne({
        where: { id: registeredById },
      });
      if (!user) {
        throw new NotFoundException(`User ${registeredById} no encontrado`);
      }
      animal.registeredBy = user;
    }

    this.animalRepo.merge(animal, rest);

    try {
      return await this.animalRepo.save(animal);
    } catch (err) {
      this.handleError(err);
    }
  }

  async remove(id: string) {
    const animal = await this.findOne(id);
    await this.animalRepo.remove(animal);

    return { message: 'Animal eliminado exitosamente' };
  }

  private handleError(err: unknown): never {
    if (err instanceof QueryFailedError) {
      const error = err as QueryFailedError & {
        code?: string;
        detail?: string;
      };

      if (error.code === '23505') {
        throw new BadRequestException(
          `Valor duplicado: ${error.detail ?? ''}`,
        );
      }
    }

    this.logger.error(
      err instanceof Error ? err.stack : JSON.stringify(err),
    );

    throw new InternalServerErrorException(
      'Error inesperado — revisa los logs',
    );
  }
async uploadImagen(id: string, file: Express.Multer.File): Promise<Animal> {
    // 1. Verificar que el animal existe (lanza 404 si no)
    await this.findOne(id);

    // 2. Subir el buffer a Cloudinary y recibir la URL
    const url = await this.cloudinaryService.uploadBuffer(
      file.buffer,
      'animales-adopcion', // carpeta en tu cuenta Cloudinary
    );

    // 3. Guardar la URL en la columna "imagen"
    await this.animalRepo.update(id, { imagen: url });

    // 4. Retornar el animal actualizado
    return this.findOne(id);
  }
}
