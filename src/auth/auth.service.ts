import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestingUserRepository, UserRepository } from './user.repository';
import {
  AuthCredentialsDto,
  TestingDto,
  UpdatableUserInfos,
} from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private testingUserRepository: TestingUserRepository,
    private jwtService: JwtService,
  ) {}

  async testingSignUp(testingDto: TestingDto): Promise<void> {
    const { username } = testingDto;

    const user = await this.testingUserRepository.findOneBy({ username });
    if (user) {
      throw new UnauthorizedException(
        `유저명 '${username}' 은 존재하고 있습니다.`,
      );
    }
    return this.testingUserRepository.createTestingUser(testingDto);
  }

  async testingSignIn(
    testingDto: TestingDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { email, username } = testingDto;
    const user = await this.testingUserRepository.findOneBy({ username });

    if (user) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, {
        expiresIn: '1y',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax', // SameSite 설정 (Strict, Lax, None 중 선택)
      });

      const response = {
        accessToken,
        refreshToken,
      };
      console.log(response);
      return response;
    } else {
      throw new UnauthorizedException('로그인 정보를 다시 확인 바랍니다.');
    }
  }

  async testingRefreshToken(
    refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    try {
      const { username } = this.jwtService.verify(refreshToken);
      const user = await this.testingUserRepository.findOneBy({ username });

      if (user) {
        const payload = { username };
        const newAccesstoken = await this.jwtService.sign(payload);

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });

        return {
          accessToken: newAccesstoken,
        };
      } else {
        throw new UnauthorizedException('로그인 정보를 다시 확인 바랍니다.');
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { uid } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ uid });
    if (user) {
      const payload = { uid };
      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = await this.jwtService.sign(payload, {
        expiresIn: '1y',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // maxAge: 60 * 60 * 24 * 365,
        maxAge: 60,
        sameSite: 'lax', // SameSite 설정 (Strict, Lax, None 중 선택)
      });

      const response = {
        accessToken,
        refreshToken,
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

  async refreshToken(
    refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { uid } = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOneBy({ uid });

      if (user) {
        const payload = { uid };
        const newAccesstoken = await this.jwtService.sign(payload);
        const newRefreshToken = await this.jwtService.sign(payload, {
          expiresIn: '1d',
        });

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });

        return {
          accessToken: newAccesstoken,
          refreshToken: newRefreshToken,
        };
      } else {
        throw new UnauthorizedException('로그인 정보를 다시 확인 바랍니다.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find(); // Use the find method to get all users
  }

  async getUserById(id: number): Promise<User> {
    const found = await this.userRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`${found.username}를 발견하지 못했습니다.`);
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
    const found = await this.userRepository.findOneBy({ id });
    const result = await this.userRepository.delete({
      id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`${found.username}를 발견하지 못했습니다.`);
    }
  }
}
