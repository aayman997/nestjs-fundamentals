import { IsString, IsOptional, IsArray, IsDateString, IsMilitaryTime, ArrayMinSize, IsNumber } from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @IsOptional()
  @IsDateString()
  readonly releasedDate: Date;

  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
