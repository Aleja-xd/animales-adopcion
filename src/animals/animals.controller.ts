import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('animals')

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @ApiOperation({ summary: 'Registrar un nuevo animal' })
  @ApiResponse({ status: 201, description: 'Animal creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (validación del DTO)' })

  @Post()
  create(@Body() dto: CreateAnimalDto) {
    return this.animalsService.create(dto);
  }

  @ApiOperation({ summary: 'Listar animales con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { data, total, page, limit }' })

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un animal por UUID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiResponse({ status: 200, description: 'Animal encontrado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  // ParseUUIDPipe valida que :id sea un UUID válido
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar datos de un animal' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Animal actualizado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAnimalDto) {
    return this.animalsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar un animal' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Animal eliminado' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.animalsService.remove(id);
  }

  @Post(':id/imagen')
  @ApiOperation({ summary: 'Subir o reemplazar la foto del animal' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del animal' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['imagen'],
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del animal (JPEG, PNG o WebP · máx 2 MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Animal con campo imagen actualizado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido (tipo o tamaño incorrecto)' })
  @ApiResponse({ status: 404, description: 'Animal no encontrado' })

  @UseInterceptors(FileInterceptor('imagen'))
  uploadImagen(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2 MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.animalsService.uploadImagen(id, file);
  }
}
