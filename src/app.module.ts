import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './controllers/login.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { VisitReportController } from './controllers/visitReport.controller';
import { LoggedInUserOnly } from './middleware/loggedInUser';
import { LogoutController } from './controllers/logout.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    LoginController,
    DashboardController,
    VisitReportController,
    LogoutController
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedInUserOnly)
      .forRoutes(DashboardController, VisitReportController)
  }
}
