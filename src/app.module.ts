import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './controllers/login.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { VisitReportController } from './controllers/visitReport.controller';
import { SetLoggedInUser } from './middleware/loggedInUser';
import { LogoutController } from './controllers/logout.controller';
import { ConfigModule } from '@nestjs/config';
import { TaskService } from './services/taskService';
import { UtilityService } from './services/utilityService';
import { VisitReportService } from './services/visitReportService';
import { VerifyLogin } from './middleware/verifyLogin';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    LoginController,
    AppController,
    DashboardController,
    VisitReportController,
    LogoutController,
  ],
  providers: [AppService, TaskService, UtilityService, VisitReportService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyLogin)
      .forRoutes(DashboardController, VisitReportController, AppController);
    consumer
      .apply(SetLoggedInUser)
      .forRoutes(
        DashboardController,
        VisitReportController,
        AppController,
        LoginController,
      );
  }
}
