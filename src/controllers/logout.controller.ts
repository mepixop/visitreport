import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('/logout')
export class LogoutController {
  @Get()
  logout(@Res() response: Response) {
    response.cookie('loggedInUser', '', { maxAge: 1 });
    response.status(302).redirect('/login');
  }
}
