import { Controller, Get, Query } from '@nestjs/common';
import { AppleRevokeService } from './apple-revoke.service';

@Controller('apple-revoke')
export class AppleRevokeController {
  constructor(private appleRevokeService: AppleRevokeService) {}

  @Get('/refreshToken')
  async getRefreshToken(@Query('code') code: string): Promise<string> {
    const refreshToken = await this.appleRevokeService.getRefreshToken(code);
    return refreshToken;
  }

  @Get('/revokeToken')
  async getRevokeToken(
    @Query('refresh_token') refresh_token: string,
  ): Promise<string> {
    const revokeToken =
      await this.appleRevokeService.getRevokeToken(refresh_token);
    return revokeToken;
  }
}
