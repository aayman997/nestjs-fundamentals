import { IsString, IsNotEmpty, IsArray, IsDateString, IsMilitaryTime, ArrayMinSize, IsOptional, IsNumber } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @IsString()
  @IsMilitaryTime()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
