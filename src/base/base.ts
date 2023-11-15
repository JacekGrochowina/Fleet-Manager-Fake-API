import express, { Express, NextFunction, Request, Response } from 'express';
import { Dictionaries } from '../routes/dictionaries/index.js';
import { Vehicles } from '../routes/vehicles/index.js';
import { Drivers } from '../routes/drivers/index.js';
import { Orders } from '../routes/orders/index.js';
import { DelayHandler } from '../shared/services/delay-handler.js';
import { authMiddleware } from '../shared/services/auth-middleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

export class Server {
  public static jwtAuthEnable: boolean = this.getInitBooleanFronEnv('JWT_AUTH');
  public static requestDelayEnable: boolean = this.getInitBooleanFronEnv('REQUEST_DELAY_ENABLE');
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
  }

  public static createEndpoint(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    handler: (req: Request, res: Response) => void
  ): void {
    const middlewares = this.jwtAuthEnable ? [authMiddleware] : [];

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

  private static getInitBooleanFronEnv(key: string): boolean {
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
