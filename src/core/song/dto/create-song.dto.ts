import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
  @IsString({ message: 'Digite um titulo válido' })
  @IsNotEmpty({ message: 'Digite um titulo válido' })
  public title: string;

  @IsString({ message: 'Digite uma descrição válida' })
  @IsNotEmpty({ message: 'Digite uma descrição válida' })
  public description: string;

  @IsString({ message: 'Digite um artista válido' })
  @IsNotEmpty({ message: 'Digite um artista válido' })
  public artist: string;

  @IsString({ message: 'Digite uma letra válida' })
  @IsNotEmpty({ message: 'Digite uma letra válida' })
  public lyrics: string;

  public duration: number;
  public thumbnail: string;
}
