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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  UpdatableUserInfos,
} from './dto/auth-credential.dto';
import { User } from './user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { UploadImageServce } from 'src/upload/uploadImage.service';
import { UploadPath } from 'src/upload/uploadPath';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uploadImageServce: UploadImageServce,
  ) {}

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
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    let imgUrl: string = '';

    const uid = req['uid'];
    authCredentialsDto.uid = uid;

    const username = authCredentialsDto.username;

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.uploadImageServce.upload(
          UploadPath.profileImages,
          username,
          image,
        );
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${UploadPath.profileImages}/${username}/${key}`;
      }),
    );
    authCredentialsDto.avatarUrl = imgUrl;

    await this.authService.signUp(authCredentialsDto);
    return await this.authService.signIn(authCredentialsDto);
  }

  @Post('/profile')
  @UseGuards(AuthGuard())
  findUserData(@GetUser() user: User) {
    return user;
  }

  @Post('/isSignUp')
  isSignUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<boolean> {
    return this.authService.isSignUp(authCredentialsDto);
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
    const username = updatableUserInfos.username;

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.uploadImageServce.upload(
          UploadPath.profileImages,
          username,
          image,
        );
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${UploadPath.profileImages}/${username}/${key}`;
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
