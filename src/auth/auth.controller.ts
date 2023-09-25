import {
  Body,
  Controller,
  Get,
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

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImage(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFieldSizeValidator({ maxSize: 1000 }),
          // new FileExtensionValidator({ extensions: ['jpg', 'png'] }),
        ],
      }),
    )
    images,
  ) {
    console.log(`images : ${images}`);
    const imgUrl: string[] = [];
    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.authService.upload(image);
        imgUrl.push(`${key}`);
      }),
    );
    return {
      statusCode: 201,
      message: 'Image uploaded successfully',
      data: imgUrl,
    };
  }

  @Post('/signup')
  singUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.singUp(authCredentialsDto);
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
}
