import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TestingUser, User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto, TestingDto } from './dto/auth-credential.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, uid, avatarUrl } = authCredentialsDto;

    const user = this.create({
      username,
      uid,
      avatarUrl,
    });

    try {
      await this.save(user);
      console.log('User saved successfully');
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(`Username : '${username}' already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

@Injectable()
export class TestingUserRepository extends Repository<TestingUser> {
  constructor(dataSource: DataSource) {
    super(TestingUser, dataSource.createEntityManager());
  }

  async createTestingUser(testingDto: TestingDto): Promise<void> {
    const { username, email } = testingDto;

    const user = this.create({
      username,
      email,
    });

    try {
      await this.save(user);
      console.log('User saved successfully');
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(`Username : '${username}' already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
