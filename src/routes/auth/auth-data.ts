import { v4 as uuidv4 } from 'uuid';

export interface AuthInterface {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export const AUTH_DATA: AuthInterface[] = [
  {
    id: uuidv4(),
    name: 'John',
    surname: 'Smith',
    email: 'john.smith@example.com',
    password: 'qwerty',
  },
];
