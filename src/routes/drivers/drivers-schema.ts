import { z } from 'zod';

export class DriversSchema {
  public static driver = () =>
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      email: z.string(),
      birthDate: z.string(),
      drivingLicenseNumber: z.string(),
    });

  public static updateDriver = () =>
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      email: z.string(),
      birthDate: z.string(),
      drivingLicenseNumber: z.string(),
    });
}
