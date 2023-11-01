import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { accessToken, refreshToken } = request.cookies;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(accessToken);
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const payload = this.authService.refreshToken(
          refreshToken,
          request.res,
        );
        request.user = payload;
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
