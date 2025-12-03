import { Controller, Get, Post } from '@nestjs/common';

@Controller('/visit-report')
export class VisitReportController {
  @Get()
  visitReportDashboard() {
    return 'This page is an overview of all your visit reports';
  }

  @Get('/form')
  newForm() {}

  @Post('/form')
  submitForm() {}
}
