import { Controller, Get, Post, Redirect, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { getDbConnector } from 'src/models/dbConnector';
import { UserModel } from 'src/models/user';

class Cat {
  name: string;
  age: number;
  color: string;

  constructor(n: string, a: number, c: string) {
    this.name = n;
    this.age = a;
    this.color = c;
  }
}

@Controller('login')
export class LoginController {
  @Get()
  loginPage(@Req() request: Request) {
    console.log(request.cookies);
    const cats = [new Cat('Lulu', 12, 'Brown'), new Cat('Jackie', 11, 'Black')];
    return cats;
  }

  @Post()
  async doLogin(@Req() request: Request, @Res() response: Response) {
    const userModel = new UserModel(await getDbConnector());
    try {
      const loggedInUser = await userModel.getByLoginCredentials(
        request.body!['username'],
        request.body!['password'],
      );
      response.cookie(
        'loggedInUser',
        `id=${loggedInUser.id};username=${loggedInUser.username};password=${loggedInUser.password}`,
      );
      response.redirect('/dashboard');
    } catch (e) {
      response.cookie('loggedInUser', '', { maxAge: 1 });
      response.status(401).send('Unauthorized');
    }
  }
}
