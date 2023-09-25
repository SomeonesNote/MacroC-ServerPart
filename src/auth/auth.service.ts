import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  private readonly s3 = new AWS.S3();

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    AWS.config.update({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.s3;
  }

  async upload(image: Express.Multer.File) {
    const key = `${Date.now() + image.originalname}`;
    const params = {
      Bucket: 'macro-image-server',
      // ACL: 'private',
      ACL: 'public-read',
      Key: key,
      Body: image.buffer,
    };
    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }

  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new UnauthorizedException('Email already exists');
    }
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);
      // return { accessToken };
      // Set the token in the response header
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
}
