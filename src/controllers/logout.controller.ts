import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

/**
 * Controller for handling user logout.
 */
@Controller('/logout')
export class LogoutController {
  /**
   * Logs the user out by clearing the 'loggedInUser' cookie and redirecting to the login page.
   * @param {Response} response The Express response object.
   */
  @Get()
  logout(@Res() response: Response) {
    response.cookie('loggedInUser', '', { maxAge: 1 });
    response.status(302).redirect('/login');
  }
}
