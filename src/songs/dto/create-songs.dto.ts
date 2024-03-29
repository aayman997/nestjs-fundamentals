import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  ArrayMinSize,
} from 'class-validator';

export class CreateSongsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  readonly artists: string[];

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @IsString()
  @IsMilitaryTime()
  readonly duration: Date;
}
