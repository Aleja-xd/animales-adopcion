import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateAdoptionRequestDto {
  
  @ApiProperty({ example: '3fa8...', description: 'UUID del usuario' })

  @IsUUID()
  userId: string;

  
  @ApiProperty({ example: '3fa8...', description: 'UUID del animal' })

  @IsUUID()
  animalId: string;

  
  @ApiPropertyOptional({ example: 'Tengo patio grande y experiencia con perros' })

  @IsOptional() @IsString()
  message?: string;
}