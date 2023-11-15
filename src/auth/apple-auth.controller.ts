import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppleAuthService } from './apple-auth.service';

@Controller('apple-auth')
export class AppleAuthController {
  constructor(private appleAuthService: AppleAuthService) {}

  @Post('/refreshToken')
  async getRefreshToken(
    @Body('code') code: string,
    @Res() res,
  ): Promise<{ refreshToken: string }> {
    const refreshToken = await this.appleAuthService.getRefreshToken(code);
    return res.json({ refreshToken });
  }

  @Get('/revoke')
  async getRevoke(
    @Query('refresh_token') refresh_token: string,
  ): Promise<boolean> {
    await this.appleAuthService.getRevoke(refresh_token);
    return true;
  }
}
