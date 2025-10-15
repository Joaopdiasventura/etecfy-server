import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindPlaylistDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsMongoId()
  public user?: string;

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
