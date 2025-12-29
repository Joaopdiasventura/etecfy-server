import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FindSongDto {
  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public artist?: string;

  @IsOptional()
  @IsString()
  public orderBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  public limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  public page?: number;
}
