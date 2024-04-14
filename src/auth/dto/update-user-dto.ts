import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({
    example: 'John',
    description: 'Provide the new first name of the user',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'John',
    description: 'Provide the new last name of the user',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Provide the old password of the user',
  })
  @IsString()
  @IsOptional()
  oldPassword: string;

  @ApiProperty({
    description: 'Provide the new password of the user',
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Provide a boolean value whether the user is an artist or not',
  })
  @IsBoolean()
  @IsOptional()
  isArtist: boolean;
}
