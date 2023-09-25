import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

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
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com//profile-images/${key}`;
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
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.authService.getUserById(id);
  }
}
