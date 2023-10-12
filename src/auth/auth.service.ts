import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {
  AuthCredentialsDto,
  SignInCredentialsDto,
  UpdatableUserInfos,
} from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new UnauthorizedException('Email already exists');
    }
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = signInCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      const response = {
        accessToken,
      };
      return response;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find(); // Use the find method to get all users
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.userRepository.findOneBy({ id }); // Use the findOne method to get a user by id

    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`); // Throw an error if the user is not found
    }
    return found;
  }

  async updateUser(
    id: number,
    updatableUserInfos: UpdatableUserInfos,
  ): Promise<User> {
    const user = await this.getUserById(id);

    user.username = updatableUserInfos.username;
    user.avatarUrl = updatableUserInfos.avatarUrl;

    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete({
      id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
