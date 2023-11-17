import { z } from 'zod';

export class AuthSchema {
  public static register = () =>
    z.object({
      name: z.string().min(3, 'Must be at least 3 characters long'),
      surname: z.string().min(3, 'Must be at least 3 characters long'),
      email: z.string().email(),
      password: z.string().min(6, 'Must be at least 6 characters long'),
    });

  public static login = () =>
    z.object({
      email: z.string().email(),
      password: z.string(),
    });
}
