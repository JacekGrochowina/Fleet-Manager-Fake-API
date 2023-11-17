import { Server } from '../../base/base.js';
import { AuthRoutes } from './auth-routes.js';
import { Request, Response } from 'express';
import { AuthSchema } from './auth-schema.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import { AUTH_DATA, AuthInterface } from './auth-data.js';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../../shared/enums/http-status-code.enum.js';

export class Auth {
  public static list: AuthInterface[] = AUTH_DATA;

  public static routes(): void {
    Server.createEndpoint('POST',
      AuthRoutes.register(),
      (req: Request, res: Response) => this.register(req, res),
      true,
    );

    Server.createEndpoint('POST',
      AuthRoutes.login(),
      (req: Request, res: Response) => this.login(req, res),
      true,
    );
  }

  private static register(req: Request, res: Response): void {
    const newUser = AuthSchema.register().parse(req.body);
    const emailExist = this.list.find(
      (user) => user.email === req.body.email
    );

    if (emailExist) {
      return ErrorHandler.handleBadRequest(res, 'The email address provided is already in use');
    }

    try {
      this.list.push(<AuthInterface><unknown>newUser);
      SuccessHandler.handleCreated(res, 'User Registered');
    } catch (error) {
      ErrorHandler.handleBadRequest(res, error.message);
    }
  }

  private static login(req: Request, res: Response): void {
    AuthSchema.login().parse(req.body);

    const user = this.list.find(
      (user) => user.email === req.body.email
    );

    if (!user) {
      return ErrorHandler.handleBadRequest(res, 'The email address not found');
    }

    if (user.password !== req.body.password) {
      return ErrorHandler.handleBadRequest(res, 'Incorrect password');
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res
      .header('auth-token', token)
      .status(HttpStatusCode.OK)
      .send({
        jwt: token,
      });
  }
}
