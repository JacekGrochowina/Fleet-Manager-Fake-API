import { z } from 'zod';
import { OrderStatus } from './orders-data.js';

export class OrdersSchema {
  public static order = () =>
    z.object({
      id: z.string(),
      pickupLocation: z.string(),
      deliveryLocation: z.string(),
      cargoDescription: z.string(),
      pickupTime: z.string(),
      deliveryTime: z.string(),
      vehicleId: z.string(),
      driverId: z.string(),
      status: z.nativeEnum(OrderStatus),
    });

  public static updateOrder = () =>
    z.object({
      pickupLocation: z.string(),
      deliveryLocation: z.string(),
      cargoDescription: z.string(),
      pickupTime: z.string(),
      deliveryTime: z.string(),
      vehicleId: z.string(),
      driverId: z.string(),
      status: z.nativeEnum(OrderStatus),
    });
}
