import { v4 as uuidv4 } from 'uuid';
import { DRIVERS_DATA } from '../drivers/drivers-data.js';

export enum VehicleType {
  truck = 'Truck',
  van = 'Van',
}

export enum VehicleStatus {
  available = 'Available',
  inUse = 'In use',
  underMaintenance = 'Under Maintenance'
}

export interface VehicleInterface {
  id: string;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  driverId: string | null;
}

export const VEHICLES_DATA: VehicleInterface[] = [
  {
    id: uuidv4(),
    brand: 'Peugeot',
    model: 'Boxer',
    year: 2022,
    registrationNumber: 'ABC123',
    type: VehicleType.truck,
    status: VehicleStatus.available,
    driverId: DRIVERS_DATA[1].id,
  },
  {
    id: uuidv4(),
    brand: 'Fiat',
    model: 'Ducato',
    year: 2021,
    registrationNumber: 'DEF456',
    type: VehicleType.van,
    status: VehicleStatus.inUse,
    driverId: DRIVERS_DATA[3].id,
  },
  {
    id: uuidv4(),
    brand: 'Ford',
    model: 'Transit',
    year: 2020,
    registrationNumber: 'GHI789',
    type: VehicleType.van,
    status: VehicleStatus.available,
    driverId: DRIVERS_DATA[0].id,
  },
  {
    id: uuidv4(),
    brand: 'Renault',
    model: 'Master',
    year: 2023,
    registrationNumber: 'JKL012',
    type: VehicleType.truck,
    status: VehicleStatus.underMaintenance,
    driverId: DRIVERS_DATA[2].id,
  },
  {
    id: uuidv4(),
    brand: 'Mercedes-Benz',
    model: 'Sprinter',
    year: 2019,
    registrationNumber: 'MNO345',
    type: VehicleType.van,
    status: VehicleStatus.available,
    driverId: null,
  },
  {
    id: uuidv4(),
    brand: 'DAF',
    model: 'XF480 FT',
    year: 2018,
    registrationNumber: 'PQR678',
    type: VehicleType.truck,
    status: VehicleStatus.available,
    driverId: null,
  },
  {
    id: uuidv4(),
    brand: 'Scania',
    model: 'R450',
    year: 2021,
    registrationNumber: 'STU901',
    type: VehicleType.van,
    status: VehicleStatus.available,
    driverId: DRIVERS_DATA[4].id,
  },
  {
    id: uuidv4(),
    brand: 'MAN',
    model: 'TGX',
    year: 2018,
    registrationNumber: 'VWX234',
    type: VehicleType.truck,
    status: VehicleStatus.inUse,
    driverId: DRIVERS_DATA[6].id,
  },
  {
    id: uuidv4(),
    brand: 'Renault',
    model: 'T480',
    year: 2019,
    registrationNumber: 'YZA567',
    type: VehicleType.van,
    status: VehicleStatus.available,
    driverId: null,
  },
  {
    id: uuidv4(),
    brand: 'Volvo',
    model: 'FH540',
    year: 2022,
    registrationNumber: 'BCD890',
    type: VehicleType.truck,
    status: VehicleStatus.available,
    driverId: DRIVERS_DATA[5].id,
  },
];
