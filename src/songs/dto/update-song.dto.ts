import { IsString, IsOptional, IsArray, IsDateString, IsMilitaryTime, ArrayMinSize, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSongDto {
  @ApiProperty({
    example: 'Sugar',
    description: 'Provide the new title of the song',
  })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    example: '[1, 2]',
    description: 'Provide a new list of artist ids for the song ',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  readonly artists: number[];

  @ApiProperty({
    example: '2023-05-11',
    description: 'Provide the new released date of the song',
  })
  @IsOptional()
  @IsDateString()
  readonly releasedDate: Date;

  @ApiProperty({
    example: '02:34',
    description: 'Provide the new duration/length of the song',
  })
  @IsString()
  @IsOptional()
  @IsMilitaryTime()
  readonly duration: Date;

  @ApiProperty({
    example: 'I should told you that I wanted you for me You make it really hard to sleep You keep me up Baby...',
    description: 'Provide the new lyrics of the song',
  })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
