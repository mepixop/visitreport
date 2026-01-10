import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { VisitReportService } from 'src/services/visitReportService';

/**
 * Controller for handling visit report related requests.
 */
@Controller('/visit-report')
export class VisitReportController {
  constructor(private visitReportService: VisitReportService) {}

  /**
   * Renders the visit report dashboard page.
   * @param {Request} req The express request object.
   * @param {Response} res The express response object.
   */
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

  /**
   * Renders the new visit report form.
   * @param {Request} req The express request object.
   * @param {Response} res The express response object.
   */
  @Get('/form')
  newForm(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];
    res.render('visitReportForm', {
      user: user,
    });
  }

  /**
   * Handles the submission of the new visit report form.
   * @param {Request} req The express request object.
   * @param {Response} res The express response object.
   */
  @Post('/form')
  async submitForm(@Req() req: Request, @Res() res: Response) {
    console.log(req.body);
    const user = req['loggedInUser'];
    const errors = await this.visitReportService.createVisitReport(
      req.body,
      user,
    );
    if (errors.length > 0)
      res.status(200).send({
        error: true,
        errors: errors,
        redirectUrl: '',
      });
    else
      res.status(200).send({
        error: false,
        errors: [],
        redirectUrl: '/visit-report',
      });
  }
}
