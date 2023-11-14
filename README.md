# Fleet Manager (Fake API)

This project provides a hands-on experience for frontend developers eager to learn the ropes of working with APIs. Designed as a self-contained application, our simulator doesn't rely on external databases but instead operates with local variables.

## Introduction

### Features

- **Local Data Management:** No need for external databases; all data is managed locally.
- **CRUD Operations:** Full support for Create, Read, Update, and Delete operations for vehicles, drivers, and orders.
- **Pagination and Sorting:** Practice pagination, sorting, and filtering with ease.
- **Realistic Data:** Simulated data mimics real-world scenarios, offering practical experience.
- **Perfect for Learning:** Ideal for frontend projects, coding exercises, and educational purposes.

## Documentation

👩🏻‍💻 Start template is based on a [node-typescript-boilerplate](https://github.com/jsynowiec/node-typescript-boilerplate).

🏃🏽 Instant Value: All basic tools included and configured:

- [TypeScript][typescript] [5.1][typescript-5-1]
- [ESM][esm]
- [ESLint][eslint] with some initial rules recommendation
- [Jest][jest] for fast unit testing and code coverage
- Type definitions for Node.js and Jest
- [Prettier][prettier] to enforce consistent code style
- NPM [scripts](#available-scripts) for common operations
- [EditorConfig][editorconfig] for consistent coding style
- Reproducible environments thanks to [Volta][volta]
- Example configuration for [GitHub Actions][gh-actions]
- Simple example of TypeScript code and unit test

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/QuokkaSchool/Fleet-Manager-Fake-API.git
cd Fleet-Manager-Fake-API
npm install
```

### Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Endpoints

Root URL

```sh
  http://localhost:8080
```

## Vehicles

### GET [Vehicles/List] Get Vehicles List

```sh
  /vehicles
```

Query Params

| Key  | Description | Value |
| ------------- | ------------- | ------------- |
| page  | active page  | number |
| limit  | limit of items per page | number |
| sort  | specifies the property by which you want to sort the data | id \| brand \| model \| year \| registrationNumber \| type \| status |
| order  | defines the sorting order for the specified property | asc \| desc |

Response Type

```
{
  "items": [
    {
      "brand": string,
      "model": string,
      "year": number,
      "registrationNumber": string,
      "type": "Ciężarówka" | "Furgonetka",
      "status": "Dostępny" | "W użyciu" | "Podczas prac technicznych",
      "driverId": string
    },
    {
      "brand": string,
      "model": string,
      "year": number,
      "registrationNumber": string,
      "type": "Ciężarówka" | "Furgonetka",
      "status": "Dostępny" | "W użyciu" | "Podczas prac technicznych",
      "driverId": string
    }
  ],
  "info": [
    "page": number,
    "limit": number,
    "totalResults": number,
  ]
}
```

Response Example

```json
{
  "items": [
    {
      "id": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
      "brand": "Volvo",
      "model": "FH16",
      "year": 2022,
      "registrationNumber": "ABC123",
      "type": "Ciężarówka",
      "status": "Dostępny",
      "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad"
    },
    {
      "id": "fb61663d-f80a-45bb-82c1-8b0a4ea9f8bc",
      "brand": "Mercedes-Benz",
      "model": "Sprinter",
      "year": 2021,
      "registrationNumber": "DEF456",
      "type": "Furgonetka",
      "status": "W użyciu",
      "driverId": "1195798b-cbd3-4707-a07d-f00487c25577"
    },
  ],
  "info": [
    "page": 1,
    "limit": 2,
    "totalResults": 10,
  ]
}
```

### GET [Vehicles/Item] Get Vehicle Item

```sh
  /vehicles/:id
```

Response Type

```
{
  "id": string,
  "brand": string,
  "model": string,
  "year": number,
  "registrationNumber": string,
  "type": "Ciężarówka" | "Furgonetka",
  "status": "Dostępny" | "W użyciu" | "Podczas prac technicznych",
  "driverId": string
}
```

Response Example

```json
{
  "id": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
  "brand": "Volvo",
  "model": "FH16",
  "year": 2022,
  "registrationNumber": "ABC123",
  "type": "Ciężarówka",
  "status": "Dostępny",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad"
}
```

### POST [Vehicles/Add] Add Vehicle

```sh
  /vehicles/add
```

Request Type

```
{
  "brand": string,
  "model": string,
  "year": number,
  "registrationNumber": string,
  "type": "Ciężarówka" | "Furgonetka",
  "status": "Dostępny" | "W użyciu" | "Podczas prac technicznych",
  "driverId": string
}
```

Request Example

```json
{
  "brand": "Volvo",
  "model": "FH16",
  "year": 2022,
  "registrationNumber": "ABC123",
  "type": "Ciężarówka",
  "status": "Dostępny",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad"
}
```

Response Type

```
{
    "message": string
}
```

### PUT [Vehicles/Update] Update Vehicle

```sh
  /vehicles/update/:id
```

Request Type

```
{
  "brand": string,
  "model": string,
  "year": number,
  "registrationNumber": string,
  "type": "Ciężarówka" | "Furgonetka",
  "status": "Dostępny" | "W użyciu" | "Podczas prac technicznych",
  "driverId": string
}
```

Request Example

```json
{
  "brand": "Volvo",
  "model": "FH16",
  "year": 2022,
  "registrationNumber": "ABC123",
  "type": "Ciężarówka",
  "status": "Dostępny",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad"
}
```

Response Type

```
{
    "message": string
}
```

### DELETE [Vehicles/Del] Del Vehicle

```sh
  /vehicles/delete/:id
```

Response Type

```
{
    "message": string
}
```

### GET [Vehicles/ListPDF] Get Vehicles List PDF

```sh
  /vehicles/list/download/pdf
```

### GET [Vehicles/ListXLSX] Get Vehicles List XLSX

```sh
  /vehicles/list/download/xlsx
```

## Drivers

### GET [Drivers/List] Get Drivers List

```sh
  /drivers
```

Query Params

| Key  | Description | Value |
| ------------- | ------------- | ------------- |
| page  | active page  | number |
| limit  | limit of items per page | number |
| sort  | specifies the property by which you want to sort the data | id \| firstName \| lastName \| phoneNumber \| email \| birthDate \| drivingLicenseNumber |
| order  | defines the sorting order for the specified property | asc \| desc |

Response Type

```
{
  "items": [
    {
      "id": string,
      "firstName": string,
      "lastName": string,
      "phoneNumber": string,
      "email": string,
      "birthDate": string,
      "drivingLicenseNumber": string
    },
    {
      "id": string,
      "firstName": string,
      "lastName": string,
      "phoneNumber": string,
      "email": string,
      "birthDate": string,
      "drivingLicenseNumber": string
    },
  ],
  "info": [
    "page": number,
    "limit": number,
    "totalResults": number,
  ]
}
```

Response Example

```json
{
  "items": [
    {
      "id": "9a539bce-4d3f-4aa1-9e28-6bcf7e31905a",
      "firstName": "Adam",
      "lastName": "Woźniak",
      "phoneNumber": "222222222",
      "email": "adam.wozniak@example.com",
      "birthDate": "1984-11-30",
      "drivingLicenseNumber": "AAAA11111"
    },
    {
      "id": "16dae322-a651-49a2-8c5f-02b029a03aad",
      "firstName": "Krzysztof",
      "lastName": "Kowalski",
      "phoneNumber": "987654321",
      "email": "krzysztof.kowalski@example.com",
      "birthDate": "1985-05-15",
      "drivingLicenseNumber": "EFGH67890"
    },
  ],
  "info": [
    "page": 1,
    "limit": 2,
    "totalResults": 10,
  ]
}
```

### GET [Drivers/Item] Get Driver Item

```sh
  /drivers/:id
```

Response Type

```
{
  "id": string,
  "firstName": string,
  "lastName": string,
  "phoneNumber": string,
  "email": string,
  "birthDate": string,
  "drivingLicenseNumber": string
}
```

Response Example

```json
{
  "id": "9a539bce-4d3f-4aa1-9e28-6bcf7e31905a",
  "firstName": "Adam",
  "lastName": "Woźniak",
  "phoneNumber": "222222222",
  "email": "adam.wozniak@example.com",
  "birthDate": "1984-11-30",
  "drivingLicenseNumber": "AAAA11111"
}
```

### POST [Drivers/Add] Add Driver

```sh
  /drivers/add
```

Request Type

```
{
  "firstName": string,
  "lastName": string,
  "phoneNumber": string,
  "email": string,
  "birthDate": string,
  "drivingLicenseNumber": string
}
```

Request Example

```json
{
  "firstName": "Adam",
  "lastName": "Woźniak",
  "phoneNumber": "222222222",
  "email": "adam.wozniak@example.com",
  "birthDate": "1984-11-30",
  "drivingLicenseNumber": "AAAA11111"
}
```

Response Type

```
{
    "message": string
}
```

### PUT [Drivers/Update] Update Driver

```sh
  /drivers/update/:id
```

Request Type

```
{
  "firstName": string,
  "lastName": string,
  "phoneNumber": string,
  "email": string,
  "birthDate": string,
  "drivingLicenseNumber": string
}
```

Request Example

```json
{
  "firstName": "Krzysztof",
  "lastName": "Kowalskiii",
  "phoneNumber": "987654321",
  "email": "krzysztof.kowalski@example.com",
  "birthDate": "1985-05-15",
  "drivingLicenseNumber": "EFGH67890"
}
```

Response Type

```
{
    "message": string
}
```

### DELETE [Drivers/Del] Del Driver

```sh
  /drivers/delete/:id
```

Response Type

```
{
    "message": string
}
```

### GET [Drivers/ListPDF] Get Drivers List PDF

```sh
  /drivers/list/download/pdf
```

### GET [Drivers/ListXLSX] Get Drivers List XLSX

```sh
  /drivers/list/download/xlsx
```

## Orders

### GET [Orders/List] Get Orders List

```sh
  /orders
```

Query Params

| Key  | Description | Value |
| ------------- | ------------- | ------------- |
| page  | active page  | number |
| limit  | limit of items per page | number |
| sort  | specifies the property by which you want to sort the data | id \| pickupLocation \| deliveryLocation \| cargoDescription \| pickupTime \| deliveryTime \| status |
| order  | defines the sorting order for the specified property | asc \| desc |

Response Type

```
{
  "items": [
    {
      "id": string,
      "pickupLocation": string,
      "deliveryLocation": string,
      "cargoDescription": string,
      "pickupTime": string,
      "deliveryTime": string,
      "vehicleId": string,
      "driverId": string,
      "status": "Oczekujące" | "W trakcie" | "Ukończone"
    },
    {
      "id": string,
      "pickupLocation": string,
      "deliveryLocation": string,
      "cargoDescription": string,
      "pickupTime": string,
      "deliveryTime": string,
      "vehicleId": string,
      "driverId": string,
      "status": "Oczekujące" | "W trakcie" | "Ukończone"
    },
  ],
  "info": [
    "page": number,
    "limit": number,
    "totalResults": number,
  ]
}
```

Response Example

```json
{
  "items": [
    {
      "id": "c0a42a53-902f-4b68-9740-d9c7dc3ea2c7",
      "pickupLocation": "Warszawa, Polska",
      "deliveryLocation": "Kraków, Polska",
      "cargoDescription": "Paczka o wymiarach 30x20x15 cm",
      "pickupTime": "2023-11-01T10:00:00Z",
      "deliveryTime": "2023-11-01T14:00:00Z",
      "vehicleId": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
      "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad",
      "status": "Oczekujące"
    },
    {
      "id": "ae047350-b744-4a0d-ad23-e168a67e0b6f",
      "pickupLocation": "Gdańsk, Polska",
      "deliveryLocation": "Szczecin, Polska",
      "cargoDescription": "Paleta z towarem",
      "pickupTime": "2023-11-02T08:30:00Z",
      "deliveryTime": "2023-11-02T16:30:00Z",
      "vehicleId": "fb61663d-f80a-45bb-82c1-8b0a4ea9f8bc",
      "driverId": "1195798b-cbd3-4707-a07d-f00487c25577",
      "status": "W trakcie"
    },
  ],
  "info": [
    "page": 1,
    "limit": 2,
    "totalResults": 10,
  ]
}
```

### GET [Orders/Item] Get Order Item

```sh
  /orders/:id
```

Response Type

```
{
  "id": string,
  "pickupLocation": string,
  "deliveryLocation": string,
  "cargoDescription": string,
  "pickupTime": string,
  "deliveryTime": string,
  "vehicleId": string,
  "driverId": string,
  "status": "Oczekujące" | "W trakcie" | "Ukończone"
}
```

Response Example

```json
{
  "id": "c0a42a53-902f-4b68-9740-d9c7dc3ea2c7",
  "pickupLocation": "Warszawa, Polska",
  "deliveryLocation": "Kraków, Polska",
  "cargoDescription": "Paczka o wymiarach 30x20x15 cm",
  "pickupTime": "2023-11-01T10:00:00Z",
  "deliveryTime": "2023-11-01T14:00:00Z",
  "vehicleId": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad",
  "status": "Oczekujące"
}
```

### POST [Orders/Add] Add Order

```sh
  /orders/add
```

Request Type

```
{
  "pickupLocation": string,
  "deliveryLocation": string,
  "cargoDescription": string,
  "pickupTime": string,
  "deliveryTime": string,
  "vehicleId": string,
  "driverId": string,
  "status": "Oczekujące" | "W trakcie" | "Ukończone"
}
```

Request Example

```json
{
  "pickupLocation": "Warszawa, Polska",
  "deliveryLocation": "Kraków, Polska",
  "cargoDescription": "Paczka o wymiarach 30x20x15 cm",
  "pickupTime": "2023-11-01T10:00:00Z",
  "deliveryTime": "2023-11-01T14:00:00Z",
  "vehicleId": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad",
  "status": "Oczekujące"
}
```

Response Type

```
{
    "message": string
}
```

### PUT [Orders/Update] Update Order

```sh
  /orders/update/:id
```

Request Type

```
{
  "pickupLocation": string,
  "deliveryLocation": string,
  "cargoDescription": string,
  "pickupTime": string,
  "deliveryTime": string,
  "vehicleId": string,
  "driverId": string,
  "status": "Oczekujące" | "W trakcie" | "Ukończone"
}
```

Request Example

```json
{
  "pickupLocation": "Warszawa, Polska",
  "deliveryLocation": "Kraków, Polska",
  "cargoDescription": "Paczka o wymiarach 30x20x15 cm",
  "pickupTime": "2023-11-01T10:00:00Z",
  "deliveryTime": "2023-11-01T14:00:00Z",
  "vehicleId": "687b8675-2e45-47f8-a3b9-31ee52bccc74",
  "driverId": "16dae322-a651-49a2-8c5f-02b029a03aad",
  "status": "Oczekujące"
}
```

Response Type

```
{
    "message": string
}
```

### DELETE [Orders/Del] Del Order

```sh
  /orders/delete/:id
```

Response Type

```
{
    "message": string
}
```

### GET [Orders/ListPDF] Get Orders List PDF

```sh
  /orders/list/download/pdf
```

### GET [Orders/ListXLSX] Get Orders List XLSX

```sh
  /orders/list/download/xlsx
```
