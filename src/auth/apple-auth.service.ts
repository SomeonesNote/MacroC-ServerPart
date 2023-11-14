import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import * as qs from 'querystring';

@Injectable()
export class AppleAuthService {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async registerByIDToken(payload, refreshToken): Promise<string> {
    console.log('클라이언트에서 방문함 2');
    if (payload.hasOwnProperty('id_token')) {
      const decodedObj = await this.jwtService.decode(payload.id_token);
      const uid = decodedObj.sub || '';
      const email = decodedObj.hasOwnProperty('email') ? decodedObj.email : '';

      console.log('uid:', uid);
      console.log('email:', email);
      console.log('refreshToken:', refreshToken);

      return email && uid && refreshToken;
    }
    throw new UnauthorizedException();
  }

  makeJwt(): string {
    const privateKey = process.env.AUTH_KEY;
    const token = jwt.sign(
      {
        iss: process.env.TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        aud: 'https://appleid.apple.com',
        sub: process.env.CLIENT_ID,
      },
      privateKey,
      {
        algorithm: 'ES256',
        header: {
          alg: 'ES256',
          kid: process.env.KEY_ID,
        },
      },
    );
    return token;
  }

  async getRefreshToken(code: string): Promise<string> {
    const client_secret = this.makeJwt();
    const data = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret,
      grant_type: 'authorization_code',
    };

    try {
      const res = await axios.post(
        `https://appleid.apple.com/auth/token`,
        qs.stringify(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const refreshToken = await res.data.refresh_token;
      return refreshToken;
    } catch (error) {
      console.log('Error:', error.response.data);
      throw error;
    }
  }

  async getRevokeToken(refresh_token: string): Promise<string> {
    const client_secret = this.makeJwt();
    const data = {
      token: refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret,
      token_type_hint: 'refresh_token',
    };

    try {
      const res = await axios.post(
        `https://appleid.apple.com/auth/revoke`,
        qs.stringify(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      console.log(res.data);
      return 'Complete';
    } catch (error) {
      console.log('Error:', error.response.data);
      throw error;
    }
  }
}
