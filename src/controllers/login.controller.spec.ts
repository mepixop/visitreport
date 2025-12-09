import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { LoginController } from './login.controller';
import { User } from '../domain/user';

describe('Login Controller', () => {
  let controller: LoginController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    const configService = {} as ConfigService;
    controller = new LoginController(configService);

    req = {} as unknown as Request;
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;
  });

  it('should show login page if user is not logged in', () => {
    controller.loginPage(req, res);
    expect(res.render).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it('should redirect if user is logged in', () => {
    req['loggedInUser'] = new User(0, 'test', 'test');
    controller.loginPage(req, res);
    expect(res.render).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();
  });
});
