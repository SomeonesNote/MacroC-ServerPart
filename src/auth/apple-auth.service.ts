import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import * as qs from 'querystring';

@Injectable()
export class AppleAuthService {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  makeJwt(): string {
    const privateKey = process.env.AUTH_KEY;
    const token = jwt.sign(
      {
        iss: process.env.TEAM_ID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120,
        aud: 'https://appleid.apple.com',
        sub: process.env.APP_ID,
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
      client_id: process.env.APP_ID,
      client_secret,
      grant_type: 'authorization_code',
      redirect_uri: 'https://macro-app.fly.dev/apple-auth/callback',
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

  async getRevoke(refresh_token: string): Promise<boolean> {
    const client_secret = this.makeJwt();
    const data = {
      token: refresh_token,
      client_id: process.env.APP_ID,
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
      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchApplePublicKey(keyId: string): Promise<string> {
    const res = await axios.get('https://appleid.apple.com/auth/keys');
    const keys = res.data.keys;
    const key = keys.find((key) => key.kid === keyId);
    if (!key) {
      throw new UnauthorizedException('Invalid token');
    }

    const applePublicKey = jwkToPem(key);
    return applePublicKey;
  }

  async handleAppleCallBack(token: string): Promise<void> {
    let payload: any;
    const decodedToken = jwt.decode(token, { complete: true });
    const applePublicKey = await this.fetchApplePublicKey(
      decodedToken.header.kid,
    );

    try {
      payload = jwt.verify(token, applePublicKey, {
        algorithms: ['RS256'],
      });
      payload.events = JSON.parse(payload.events);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }

    const { events } = payload;

    if (events.type === 'consent-revoked' || events.type === 'account-delete') {
      const userId = events.sub.split('.')[0];
      await this.authService.deleteUser(userId);
    }
  }
}
