import { Controller, Get, Req } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  @Get()
  dashboard(@Req() req: Request) {
    return 'This is the dashboard page for user ' + req['loggedInUser'];
  }
}
