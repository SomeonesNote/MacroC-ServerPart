import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Artist } from './artist.entity';

export const GetArtist = createParamDecorator(
  (data, ctx: ExecutionContext): Artist => {
    const req = ctx.switchToHttp().getRequest();
    return req.artist;
  },
);
