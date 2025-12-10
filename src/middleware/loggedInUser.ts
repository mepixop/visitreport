import { Injectable, NestMiddleware, Res } from '@nestjs/common';
import type { Response } from 'express';
import { User } from 'src/domain/user';
import { VerifyLogin } from './verifyLogin';

@Injectable()
export class SetLoggedInUser implements NestMiddleware {
  use(req: any, @Res() res: Response, next: (error?: any) => void) {
    if (new VerifyLogin().isValidUser(req.cookies['loggedInUser'])) {
      req['loggedInUser'] = this.parseLoggedInUser(req.cookies['loggedInUser']);
    }
    next();
  }

  private parseLoggedInUser(cookie: string): User {
    const segments = cookie.split(';');
    const user = new User(
      parseInt(segments[0].split('=')[1]),
      segments[1].split('=')[1],
      segments[2].split('=')[1],
    );
    return user;
  }
}
