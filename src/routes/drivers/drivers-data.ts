import { v4 as uuidv4 } from 'uuid';

export interface DriverInterface {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  drivingLicenseNumber: string;
}

export const DRIVERS_DATA: DriverInterface[] = [
  {
    id: uuidv4(),
    firstName: 'Piotr',
    lastName: 'Nowak',
    phoneNumber: '123456789',
    email: 'piotr.nowak@example.com',
    birthDate: '1980-01-01',
    drivingLicenseNumber: 'AMJ876611',
  },
  {
    id: uuidv4(),
    firstName: 'Ivan',
    lastName: 'Kuznetsov',
    phoneNumber: '987654321',
    email: 'ivan.kuznetsov@example.com',
    birthDate: '1970-10-20',
    drivingLicenseNumber: 'EFGH67890',
  },
  {
    id: uuidv4(),
    firstName: 'Marek',
    lastName: 'Lewandowski',
    phoneNumber: '555555555',
    email: 'marek.lewandowski@example.com',
    birthDate: '1982-12-10',
    drivingLicenseNumber: 'IJKL24680',
  },
  {
    id: uuidv4(),
    firstName: 'Michał',
    lastName: 'Wójcik',
    phoneNumber: '777777777',
    email: 'michal.wojcik@example.com',
    birthDate: '1988-07-20',
    drivingLicenseNumber: 'MNOP13579',
  },
  {
    id: uuidv4(),
    firstName: 'Mikhail',
    lastName: 'Ivanov',
    phoneNumber: '555555555',
    email: 'mikhail.ivanov@example.com',
    birthDate: '1972-05-05',
    drivingLicenseNumber: 'IJKL24680',
  },
  {
    id: uuidv4(),
    firstName: 'Łukasz',
    lastName: 'Zieliński',
    phoneNumber: '111111111',
    email: 'lukasz.zielinski@example.com',
    birthDate: '1981-09-15',
    drivingLicenseNumber: 'UVWXYZ13579',
  },
  {
    id: uuidv4(),
    firstName: 'Andriy',
    lastName: 'Zhuk',
    phoneNumber: '111111111',
    email: 'andriy.zhuk@example.com',
    birthDate: '1974-02-05',
    drivingLicenseNumber: 'UVWXYZ13579',
  },
  {
    id: uuidv4(),
    firstName: 'Marcin',
    lastName: 'Jankowski',
    phoneNumber: '333333333',
    email: 'marcin.jankowski@example.com',
    birthDate: '1987-04-10',
    drivingLicenseNumber: 'BBBB22222',
  },
];
