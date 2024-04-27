import { IsString, IsNotEmpty, IsArray, IsDateString, IsMilitaryTime, ArrayMinSize, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({
    example: 'Sugar',
    description: 'Provide the title of the song',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: '[1, 2]',
    description: 'Provide a list of artist ids for the song ',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @ApiProperty({
    example: '2023-05-11',
    description: 'Provide the released date of the song',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @ApiProperty({
    example: '02:34',
    description: 'Provide the duration/length of the song',
  })
  @IsString()
  @IsMilitaryTime()
  readonly duration: string;

  @ApiProperty({
    example: 'I should told you that I wanted you for me You make it really hard to sleep You keep me up Baby...',
    description: 'Provide the lyrics of the song',
  })
  @IsString()
  @IsOptional()
  readonly lyrics?: string;
}
