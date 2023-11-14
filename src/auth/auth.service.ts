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
  UsernameCredentialsDto,
} from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { ArtistService } from 'src/artist/artist.service';
import { ArtistRepository } from 'src/artist/artist.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private artistService: ArtistService,
    private artistRepository: ArtistRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { uid } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ uid });
    if (user) {
      throw new UnauthorizedException(`${uid}는 이미 존재합니다.`);
    }
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { uid } = signInCredentialsDto;

    const user = await this.userRepository.findOneBy({ uid });
    if (user) {
      const payload = { uid };
      const accessToken = await this.jwtService.sign(payload);
      const response = {
        accessToken,
      };

      console.log(response);
      return response;
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async isSignUp(signInCredentialsDto: SignInCredentialsDto): Promise<boolean> {
    const { uid } = signInCredentialsDto;
    const user = await this.userRepository.findOneBy({ uid });

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async usernameCheck(
    usernameCredentialsDto: UsernameCredentialsDto,
  ): Promise<boolean> {
    const { username } = usernameCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user) {
      return true;
    } else {
      return false;
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
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    const artist = await this.artistRepository.findOne({
      where: { user: { id } },
      relations: ['user'],
    });
    user.artist = null;
    artist.user = null;

    if (!user) {
      throw new NotFoundException(`유저를 발견하지 못했습니다.`);
    } else {
      await this.artistService.deleteArtist(artist.id);
      await this.artistRepository.delete(artist.id);
      await this.userRepository.delete(user.id);
    }
  }
}
