import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class VerifyLogin implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    if (this.isValidUser(req.cookies['loggedInUser'])) {
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
}
