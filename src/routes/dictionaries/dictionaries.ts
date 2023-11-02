import { v4 as uuidv4 } from 'uuid';
import { VehicleStatus, VehicleType } from '../vehicles/vehicles-data.js';
import { Server } from '../../base/base.js';
import { DictionariesRoutes } from './dictionaries-routes.js';
import { Request, Response } from 'express';
import { DelayHandler } from '../../shared/services/delay-handler.js';
import { OrderStatus } from '../orders/orders-data.js';

export interface Dictionary {
  id: string;
  value: string;
  displayValue: string;
}

export class Dictionaries {
  private static readonly vehicleTypeDictionary: Dictionary[] = this.parseEnumToDictionary(VehicleType);
  private static readonly vehicleStatusDictionary: Dictionary[] = this.parseEnumToDictionary(VehicleStatus);
  private static readonly orderStatusDictionary: Dictionary[] = this.parseEnumToDictionary(OrderStatus);

  public static routes(): void {
    Server.app.get(
      DictionariesRoutes.getVehicleType(),
      (req: Request, res: Response) => DelayHandler.delay(() =>
        this.getDictionary(req, res, this.vehicleTypeDictionary)),
    );

    Server.app.get(
      DictionariesRoutes.getVehicleStatus(),
      (req: Request, res: Response) => DelayHandler.delay(() =>
        this.getDictionary(req, res, this.vehicleStatusDictionary)),
    );

    Server.app.get(
      DictionariesRoutes.getOrderStatus(),
      (req: Request, res: Response) => DelayHandler.delay(() =>
        this.getDictionary(req, res, this.orderStatusDictionary)),
    );
  }

  private static getDictionary(_req: Request, res: Response, dictionary: unknown[]) {
    res.json(dictionary);
  }

  private static parseEnumToDictionary(enumName: unknown): Dictionary[] {
    return Object.entries(enumName).map(([key, value]) => ({
      id: uuidv4(),
      value: key,
      displayValue: value,
    }));
  }
}
