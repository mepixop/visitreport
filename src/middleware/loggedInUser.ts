import { Injectable, NestMiddleware, Res } from '@nestjs/common';
import type { Response } from 'express';
import { User } from 'src/domain/user';

@Injectable()
export class LoggedInUserOnly implements NestMiddleware {
  use(req: any, @Res() res: Response, next: (error?: any) => void) {
    if (this.isValidUser(req.cookies['loggedInUser'])) {
      req.loggedInUser = this.getLoggedInUser(req.cookies['loggedInUser']);
      next();
    } else {
      res.status(302).redirect('/login');
    }
  }

  isValidUser(cookie: string): boolean {
    if (
      !cookie ||
      !cookie.includes('id=') ||
      !cookie.includes('username=') ||
      !cookie.includes('password=')
    )
      return false;

    return true;
  }

  getLoggedInUser(cookie: string): User {
    const segments = cookie.split(';');
    const user = new User(
      parseInt(segments[0].split('=')[1]),
      segments[1].split('=')[1],
      segments[2].split('=')[1],
    );
    return user;
  }
}
