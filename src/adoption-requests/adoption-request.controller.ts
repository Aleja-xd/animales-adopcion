import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';

import { AdoptionRequestService } from './adoption-request.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Adoption Requests')
@Controller('adoption-requests')
export class AdoptionRequestController {
  constructor(
    private readonly adoptionRequestService: AdoptionRequestService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear solicitud de adopción' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  create(@Body() dto: CreateAdoptionRequestDto) {
    return this.adoptionRequestService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las solicitudes' })
  findAll() {
    return this.adoptionRequestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  findOne(@Param('id') id: string) {
    return this.adoptionRequestService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una solicitud' })
  remove(@Param('id') id: string) {
    return this.adoptionRequestService.remove(id);
  }
}
