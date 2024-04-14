import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'john_doe@example.com',
    description: 'Provide the email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
