import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

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
