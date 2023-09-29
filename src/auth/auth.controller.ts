import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  SignInCredentialsDto,
  UpdatableUserInfos,
} from './dto/auth-credential.dto';
import { User } from './user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup-with-image')
  @UseInterceptors(FilesInterceptor('images'))
  async signUpWithImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    images,
    @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    let imgUrl: string = '';

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.authService.upload(image);
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/profile-images/${key}`;
      }),
    );
    authCredentialsDto.avatarUrl = imgUrl;
    await this.authService.signUp(authCredentialsDto);
  }

  @Post('/signup')
  singUp(
    @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Post('/profile')
  @UseGuards(AuthGuard())
  getUserData(@GetUser() user: User) {
    console.log(user);
    return user;
  }

  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.authService.getUserById(id);
  }

  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('images'))
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    images,
    @Body(new ValidationPipe()) updatableUserInfos: UpdatableUserInfos,
  ): Promise<User> {
    let imgUrl: string = '';

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.authService.upload(image);
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com//profile-images/${key}`;
      }),
    );
    updatableUserInfos.avatarUrl = imgUrl;

    const updatedUser = await this.authService.updateUser(
      id,
      updatableUserInfos,
    );
    return updatedUser;
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.authService.deleteUser(id);
  }
}
