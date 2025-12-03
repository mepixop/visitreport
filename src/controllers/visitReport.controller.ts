import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('/visit-report')
export class VisitReportController {
  @Get()
  visitReportDashboard(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];
    res.render('visitReport', {
      user: user,
    });
  }

  @Get('/form')
  newForm() {}

  @Post('/form')
  submitForm() {}
}
