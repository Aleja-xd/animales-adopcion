import { ApiPropertyOptional }                   from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type }                                    from 'class-transformer';

export class QueryAnimalsDto {
  
  @ApiPropertyOptional({ example: 1,  description: 'Página (default: 1)'  })

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  
  @ApiPropertyOptional({ example: 10, description: 'Resultados por página (default: 10)' })

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;

  
  @ApiPropertyOptional({ example: 'perro', description: 'Filtrar por especie' })

  @IsOptional() @IsString()
  especie?: string;

  
  @ApiPropertyOptional({ example: 'disponible', enum: ['disponible', 'adoptado'] })

  @IsOptional() @IsIn(['disponible', 'adoptado'])
  estado?: string;
}