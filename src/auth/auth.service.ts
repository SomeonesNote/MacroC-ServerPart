import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {
  AuthCredentialsDto,
  UpdatableUserInfos,
} from './dto/auth-credential.dto';
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
    const { uid, username } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ uid });
    if (user) {
      throw new UnauthorizedException(
        `유저명 '${username}' 은 존재하고 있습니다.`,
      );
    }
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { uid } = authCredentialsDto;

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
      throw new UnauthorizedException('로그인 정보를 다시 확인 바랍니다.');
    }
  }

  // firebase 회원가입시, 이미 가입된 유저인지 db에서 확인
  async isSignUp(uid: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      uid,
    });
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
    const result = await this.userRepository.delete({
      id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
