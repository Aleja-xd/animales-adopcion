import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';
import { AdoptionRequest } from '../adoption-requests/entities/adoption-request.entity';
import { AdoptionStatus } from '../adoption-requests/entities/adoption-request.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger('SeederService');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,

    @InjectRepository(AdoptionRequest)
    private readonly requestRepo: Repository<AdoptionRequest>,
  ) {}

  async seed() {
    const already = await this.locationRepo.findOne({
      where: { name: 'Refugio Patitas Felices' },
    });

    if (already) {
      this.logger.warn('Datos ya existen. Usa clearAndSeed().');
      return;
    }

    // ── 1. Locations ─────────────────────────
    const locations = await this.locationRepo.save(
      this.locationRepo.create([
        {
          name: 'Refugio Patitas Felices',
          city: 'Medellín',
          address: 'Calle 10 #43-25',
          phone: '3041111111',
        },
        {
          name: 'Hogar Animal Bogotá',
          city: 'Bogotá',
          address: 'Carrera 7 #80-12',
          phone: '3052222222',
        },
        {
          name: 'Rescate Sur Cali',
          city: 'Cali',
          address: 'Av. 6N #22-10',
          phone: '3063333333',
        },
      ]),
    );

    this.logger.log(`✓ ${locations.length} ubicaciones`);

    // ── 2. Users ─────────────────────────────
    const users = await this.userRepo.save(
      this.userRepo.create([
        { name: 'Carlos Pérez', email: 'carlos@demo.com', phone: '3101111111' },
        { name: 'Ana García', email: 'ana@demo.com', phone: '3102222222' },
        { name: 'Luis Martínez', email: 'luis@demo.com', phone: '3103333333' },
        { name: 'María López', email: 'maria@demo.com', phone: '3104444444' },
        { name: 'Juan Rodríguez', email: 'juan@demo.com', phone: '3105555555' },
      ]),
    );

    this.logger.log(`✓ ${users.length} usuarios`);

    // ── 3. Animals ───────────────────────────
    const animals = await this.animalRepo.save(
      this.animalRepo.create([
        {
          nombre: 'Luna',
          especie: 'perro',
          edad: 18,
          descripcion: 'Labrador dorada, cariñosa y muy activa',
          estado: 'disponible',
          contacto: 'patitas@demo.com',
          location: locations[0],
          registeredBy: users[0],
        },
        {
          nombre: 'Max',
          especie: 'perro',
          edad: 36,
          descripcion: 'Pastor alemán tranquilo, ideal para familia',
          estado: 'disponible',
          contacto: 'patitas@demo.com',
          location: locations[0],
          registeredBy: users[0],
        },
        {
          nombre: 'Misi',
          especie: 'gato',
          edad: 12,
          descripcion: 'Gata siamesa, independiente y elegante',
          estado: 'disponible',
          contacto: 'patitas@demo.com',
          location: locations[0],
          registeredBy: users[1],
        },
        {
          nombre: 'Kira',
          especie: 'gato',
          edad: 24,
          descripcion: 'Gata negra, juguetona y sociable',
          estado: 'adoptado',
          contacto: 'patitas@demo.com',
          location: locations[0],
          registeredBy: users[1],
        },
        {
          nombre: 'Rocky',
          especie: 'perro',
          edad: 60,
          descripcion: 'Bulldog mayor, busca hogar tranquilo',
          estado: 'adoptado',
          contacto: 'hogar@demo.com',
          location: locations[1],
          registeredBy: users[2],
        },
        {
          nombre: 'Cleo',
          especie: 'gato',
          edad: 8,
          descripcion: 'Gatito atigrado de 8 meses, muy curioso',
          estado: 'disponible',
          contacto: 'hogar@demo.com',
          location: locations[1],
          registeredBy: users[2],
        },
        {
          nombre: 'Toby',
          especie: 'perro',
          edad: 14,
          descripcion: 'Mestizo mediano, excelente con niños',
          estado: 'disponible',
          contacto: 'hogar@demo.com',
          location: locations[1],
          registeredBy: users[3],
        },
        {
          nombre: 'Nina',
          especie: 'conejo',
          edad: 6,
          descripcion: 'Coneja blanca, mansa y fácil de cuidar',
          estado: 'disponible',
          contacto: 'rescate@demo.com',
          location: locations[2],
          registeredBy: users[4],
        },
        {
          nombre: 'Simba',
          especie: 'gato',
          edad: 30,
          descripcion: 'Gato naranja grande, duerme todo el día',
          estado: 'disponible',
          contacto: 'rescate@demo.com',
          location: locations[2],
          registeredBy: users[4],
        },
        {
          nombre: 'Bella',
          especie: 'perro',
          edad: 10,
          descripcion: 'Cachorra labrador, necesita mucha energía',
          estado: 'disponible',
          contacto: 'rescate@demo.com',
          location: locations[2],
          registeredBy: users[3],
        },
      ]),
    );

    this.logger.log(`✓ ${animals.length} animales`);

    // ── 4. Adoption Requests (CORREGIDO) ─────
    const requestEntities = [
      {
        user: users[0],
        animal: animals[0],
        status: AdoptionStatus.PENDING,
        message: 'Tengo patio grande y experiencia con perros',
    },
  {
        user: users[1],
        animal: animals[2],
        status: AdoptionStatus.APPROVED,
        message: 'Vivo sola y busco compañía tranquila',
  },
  {
        user: users[2],
        animal: animals[5],
        status: AdoptionStatus.PENDING,
        message: 'Mi familia ama los gatos, tenemos espacio',
  },
  {
        user: users[3],
        animal: animals[6],
        status: AdoptionStatus.REJECTED,
        message: 'Apartamento pequeño pero mucho amor',
   },
    ].map((data) => this.requestRepo.create(data));

    const requests = await this.requestRepo.save(requestEntities);

    this.logger.log(`✓ ${requests.length} solicitudes`);

    this.logger.log('────────────────────────────');
    this.logger.log(
      `Seed completo → ${
        animals.filter((a) => a.estado === 'disponible').length
      } disponibles · ${
        animals.filter((a) => a.estado === 'adoptado').length
      } adoptados`,
    );
  }

  async clearAndSeed() {
    this.logger.warn('Limpiando tablas...');

    await this.animalRepo.query('DELETE FROM user_animal_favorites');
    await this.animalRepo.query('DELETE FROM adoption_requests');
    await this.animalRepo.query('DELETE FROM animals');
    await this.userRepo.query('DELETE FROM users');
    await this.locationRepo.query('DELETE FROM locations');

    this.logger.log('Tablas vacías. Ejecutando seed...');
    await this.seed();
  }
}
