import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { getDbConnector } from 'src/models/dbConnector';
import { UserModel } from 'src/models/userModel';

@Controller('login')
export class LoginController {
  constructor(private configService: ConfigService) {}

  @Get()
  loginPage(@Req() req: Request, @Res() res: Response) {
    const user = req['loggedInUser'];
    console.log(user);
    if (user) {
      res.redirect('/dashboard');
    } else {
      res.render('login', {});
    }
  }

  @Post()
  async doLogin(@Req() req: Request, @Res() res: Response) {
    const userModel = new UserModel(await getDbConnector(this.configService));
    try {
      const loggedInUser = await userModel.getByLoginCredentials(
        req.body!['username'],
        req.body!['password'],
      );
      res.cookie(
        'loggedInUser',
        `id=${loggedInUser.id};username=${loggedInUser.username};password=${loggedInUser.password}`,
      );
      res.redirect('/dashboard');
    } catch (e) {
      res.cookie('loggedInUser', '', { maxAge: 1 });
      res.status(401).send('Unauthorized');
    }
  }
}
