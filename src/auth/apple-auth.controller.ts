import {
  Controller,
  Body,
  Get,
  Post,
  HttpStatus,
  Query,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppleAuthService } from './apple-auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('apple-auth')
export class AppleAuthController {
  constructor(private appleAuthService: AppleAuthService) {}

  @Get('/login')
  @UseGuards(AuthGuard('apple'))
  async appleLogin() {
    console.log('클라이언트에서 방문함 0');
    return HttpStatus.OK;
  }

  @Post('/callback')
  @UseGuards(AuthGuard('apple'))
  async appleLoginRedirect(@Body() payload, @Request() req): Promise<string> {
    console.log('클라이언트에서 방문함 1');
    if (payload.id_token) {
      return this.appleAuthService.registerByIDToken(
        payload,
        req.user.refreshToken,
      );
    }
    throw new UnauthorizedException();
  }

  @Get('/refreshToken')
  async getRefreshToken(@Query('code') code: string): Promise<string> {
    const refreshToken = await this.appleAuthService.getRefreshToken(code);
    return refreshToken;
  }

  @Get('/revokeToken')
  async getRevokeToken(
    @Query('refresh_token') refresh_token: string,
  ): Promise<string> {
    const revokeToken =
      await this.appleAuthService.getRevokeToken(refresh_token);
    return revokeToken;
  }
}
