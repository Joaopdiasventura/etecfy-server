import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  public limit?: number;

  @IsOptional()
  @IsNumber()
  public page?: number;
}
