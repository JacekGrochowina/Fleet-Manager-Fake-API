import express, { Express, NextFunction, Request, Response } from 'express';
import { Dictionaries } from '../routes/dictionaries/dictionaries.js';
import { Vehicles } from '../routes/vehicles/vehicles.js';
import { Drivers } from '../routes/drivers/drivers.js';
import { Orders } from '../routes/orders/orders.js';
import { DelayHandler } from '../shared/services/delay-handler.js';
import { authMiddleware } from '../shared/services/auth-middleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import { HttpMethods } from '../shared/types/http-methods.type.js';
import { Auth } from '../routes/auth/auth.js';

export class Server {
  public static jwtAuthEnable: boolean = this.getInitBooleanFromEnv('JWT_AUTH');
  public static requestDelayEnable: boolean = this.getInitBooleanFromEnv('REQUEST_DELAY_ENABLE');
  public static port: number = Number(process.env.PORT) || 8080;
  public static app: Express;

  public static start(): void {
    this.app = express();
    this.appConfigure();
    this.appListen();

    // Routes
    Dictionaries.routes();
    Vehicles.routes();
    Drivers.routes();
    Orders.routes();
    if(this.jwtAuthEnable) Auth.routes();
  }

  public static createEndpoint(
    method: HttpMethods,
    path: string,
    handler: (req: Request, res: Response) => void,
    isAuth: boolean = false,
  ): void {
    const middlewares = this.jwtAuthEnable && !isAuth ? [authMiddleware] : [];

    const delayedMiddlewares = this.requestDelayEnable
      ? middlewares.map((middleware) =>
        (req: Request, res: Response, next: NextFunction) => {
          DelayHandler.delay(() => middleware(req, res, next));
      })
      : middlewares;

    this.app[method.toLowerCase()](
      path,
      ...delayedMiddlewares,
      (req: Request, res: Response) => this.requestDelayEnable
        ? DelayHandler.delay(() => handler(req, res))
        : handler(req, res),
    );
  }

  private static getInitBooleanFromEnv(key: string): boolean {
    return process.env[key] === 'true';
  }

  private static appConfigure(): void {
    this.app.use(express.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private static appListen(): void {
    this.app.listen(this.port, () => {
      console.log('+-------------------------------------------------------------');
      console.log('| [\x1b[32m✓\x1b[0m] \x1b[32mThe application started successfully.\x1b[0m');
      console.log(`| [\x1b[32m✓\x1b[0m] Server is running on port ${this.port}. (http://localhost:${this.port}/)`);
      console.log(
        this.jwtAuthEnable
          ? `| [\x1b[32m✓\x1b[0m] Routes are protected by JWT token.`
          : `| [\x1b[31m✗\x1b[0m] Routes are not protected by JWT token.`
      );
      console.log(
        this.requestDelayEnable
          ? `| [\x1b[32m✓\x1b[0m] Server delay is simulated.`
          : `| [\x1b[31m✗\x1b[0m] Server delay is not simulated.`
      );
    });
  }
}
