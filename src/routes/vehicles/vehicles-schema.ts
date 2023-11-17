import { z } from 'zod';
import { VehicleStatus, VehicleType } from './vehicles-data.js';

export class VehiclesSchema {
  public static vehicle = () =>
    z.object({
      id: z.string(),
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      registrationNumber: z.string(),
      type: z.nativeEnum(VehicleType),
      status: z.nativeEnum(VehicleStatus),
      driverId: z.string().nullable(),
    });

  public static updateVehicle = () =>
    z.object({
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      registrationNumber: z.string(),
      type: z.nativeEnum(VehicleType),
      status: z.nativeEnum(VehicleStatus),
      driverId: z.string().nullable(),
    });
}
