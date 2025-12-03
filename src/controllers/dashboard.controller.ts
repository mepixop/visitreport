import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private configService: ConfigService) {}

  @Get()
  dashboard(@Req() req: Request, @Res() res: Response) {
    res.render('dashboard', {
      test: req['loggedInUser'],
    });
  }
}
