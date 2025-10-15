import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsMongoId({ message: 'faça login novamente' })
  public user: string;

  @IsNotEmpty({ message: 'Digite um nome valido' })
  @IsString({ message: 'Digite um nome valido' })
  public name: string;

  @IsArray({ message: 'Selecione apenas musicas válidas' })
  @IsMongoId({ each: true, message: 'Selecione apenas musicas válidas' })
  public songs: string[];

  public firstSong: string;
}
