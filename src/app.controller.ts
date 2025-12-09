import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';

/**
 * The main application controller.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Redirects the root path to the dashboard.
   * @param {Response} res The Express response object.
   */
  @Get()
  getHello(@Res() res: Response) {
    res.redirect('/dashboard');
  }
}
