import { Controller, Get, Query } from '@nestjs/common';
import { AppleAuthService } from './apple-auth.service';

@Controller('apple-auth')
export class AppleAuthController {
  constructor(private appleAuthService: AppleAuthService) {}

  @Get('/refreshToken')
  async getRefreshToken(@Query('code') code: string): Promise<string> {
    const refreshToken = await this.appleAuthService.getRefreshToken(code);
    return refreshToken;
  }

  @Get('/revoke')
  async getRevoke(
    @Query('refresh_token') refresh_token: string,
  ): Promise<boolean> {
    await this.appleAuthService.getRevoke(refresh_token);
    return true;
  }
}
