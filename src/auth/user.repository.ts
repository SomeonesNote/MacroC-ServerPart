import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
// import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, uid, avatarUrl } = authCredentialsDto;

    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      uid,
      avatarUrl,
    });

    console.log('Before saving user:', user);
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
