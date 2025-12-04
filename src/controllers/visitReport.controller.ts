import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { VisitReportService } from 'src/services/visitReportService';

@Controller('/visit-report')
export class VisitReportController {
  constructor(private visitReportService: VisitReportService) {}

  @Get()
  async visitReportDashboard(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];
    const visitReports =
      await this.visitReportService.getVisitReportsForDashboard(user);
    res.render('visitReport', {
      user: user,
      reports: visitReports,
    });
  }

  @Get('/form')
  newForm(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];
    res.render('visitReportForm', {
      user: user,
    });
  }
  @Post('/form')
  submitForm() {}
}
