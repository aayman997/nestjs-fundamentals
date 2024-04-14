import { Injectable, UnauthorizedException, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../auth/dto/create-user.dto';
import { User } from './users.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDTO } from '../auth/dto/update-user-dto';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/artists.entity';
import { LoginDTO } from '../auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private artistsService: ArtistsService,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const isUser = await this.userRepository.findOneBy({
      email: userDTO.email,
    });
    if (isUser) {
      throw new ConflictException('User already exists');
    }
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
    return user;
  }

  async updatePassword(userId: number, updateUserDto: UpdateUserDTO): Promise<UpdateResult> {
    const user = await this.findById(userId);
    const passwordMatched = await bcrypt.compare(updateUserDto.oldPassword, user.password);

    const salt = await bcrypt.genSalt();
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);

    const newPasswordMatchOld = await bcrypt.compare(updateUserDto.oldPassword, updateUserDto.password);

    if (passwordMatched) {
      if (newPasswordMatchOld) {
        throw new ConflictException("New password can't match old password");
      }
      delete updateUserDto.oldPassword;
      return this.userRepository.update(userId, updateUserDto);
    } else {
      throw new UnauthorizedException('Password incorrect');
    }
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('Could not find the user');
    }
    return user;
  }

  async update(userId: number, updateUserDTO: UpdateUserDTO): Promise<UpdateResult | Artist | DeleteResult> {
    if (updateUserDTO.isArtist) {
      return this.artistsService.createArtist(userId);
    }
    if (updateUserDTO.isArtist === false) {
      return this.artistsService.deleteArtist(userId);
    }

    if (updateUserDTO.password) {
      if (!updateUserDTO.oldPassword) {
        throw new UnauthorizedException('Please provide the old password');
      } else {
        return this.updatePassword(userId, updateUserDTO);
      }
    }

    if (Object.keys(updateUserDTO).length === 0) {
      throw new HttpException('No fields to update were provided.', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.update(userId, updateUserDTO);
  }

  async updateSecretKey(userId: number, twoFASecret: string): Promise<UpdateResult> {
    return this.userRepository.update(userId, {
      twoFASecret,
      enable2FA: true,
    });
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(userId, {
      enable2FA: false,
      twoFASecret: null,
    });
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
