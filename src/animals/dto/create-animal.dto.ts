import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({ example: 'Luna', description: 'Nombre del animal' })

  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'perro', description: 'Especie del animal' })
  
   @IsString()
  especie!: string;

  @ApiProperty({ example: 18, description: 'Edad en meses' })
  
  @IsInt()
  @Min(0)
  edad!: number;

  @ApiPropertyOptional({ example: 'Labrador dorada, muy activa y cariñosa' })

  @IsString()
  @MinLength(10)
  descripcion!: string;

  @ApiPropertyOptional({ example: 'disponible', enum: ['disponible', 'adoptado'], default: 'disponible' })

  @IsOptional()
  @IsIn(['disponible', 'adoptado'])
  estado?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ example: 'contacto@refugio.com' })

  @IsEmail()
  contacto!: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'UUID de la ubicación' })

  // FKs opcionales — UUIDs de relaciones
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'UUID del usuario que registra' })
  @IsOptional()
  @IsUUID()
  registeredById?: string;
}
