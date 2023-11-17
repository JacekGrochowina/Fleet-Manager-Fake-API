import { OrderInterface, ORDERS_DATA } from './orders-data.js';
import { Server } from '../../base/base.js';
import { Request, Response } from 'express';
import { OrdersRoutes } from './orders-routes.js';
import { ApiParamsBuilder } from '../../shared/services/api-params-builder.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { OrdersSchema } from './orders-schema.js';
import { v4 as uuidv4 } from 'uuid';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import PDFDocument from 'pdfkit';
import Excel from 'exceljs';
import { Vehicles } from '../vehicles/vehicles.js';
import { Drivers } from '../drivers/drivers.js';

export class Orders {
  public static list: OrderInterface[] = ORDERS_DATA;

  public static routes(): void {
    Server.createEndpoint('GET',
      OrdersRoutes.getList(),
      (req: Request, res: Response) => this.getList(req, res),
    );

    Server.createEndpoint('GET',
      OrdersRoutes.getDetails(),
      (req: Request, res: Response) => this.getDetails(req, res),
    );

    Server.createEndpoint('POST',
      OrdersRoutes.add(),
      (req: Request, res: Response) => this.add(req, res),
    );

    Server.createEndpoint('PUT',
      OrdersRoutes.update(),
      (req: Request, res: Response) => this.update(req, res),
    );

    Server.createEndpoint('DELETE',
      OrdersRoutes.remove(),
      (req: Request, res: Response) => this.remove(req, res),
    );

    Server.createEndpoint('GET',
      OrdersRoutes.exportToPDF(),
      (req: Request, res: Response) => this.exportToPDF(req, res),
    );

    Server.createEndpoint('GET',
      OrdersRoutes.exportToXLSX(),
      (req: Request, res: Response) => this.exportToXLSX(req, res),
    );
  }

  private static getList(req: Request, res: Response): void {
    const builtResponse = ApiParamsBuilder.buildList(this.list, req);
    res.json(builtResponse);
  }

  private static getDetails(req: Request, res: Response): void {
    const foundItem: OrderInterface = this.list.find(
      (order) => order.id === req.params.id
    );

    foundItem
      ? res.json(foundItem)
      : ErrorHandler.handleNotFound(res);
  }

  private static add(req: Request, res: Response): void {
    try {
      const newItem = OrdersSchema.order().parse({
        id: uuidv4(),
        ...req.body,
      });
      this.list.push(<OrderInterface><unknown>newItem);
      SuccessHandler.handleCreated(res);
    } catch (error) {
      ErrorHandler.handleBadRequest(res, error.message);
    }
  }

  private static update(req: Request, res: Response): void {
    const id = req.params.id;
    const index = this.list.findIndex(
      (vehicle) => vehicle.id === id
    );

    if (index === -1) return ErrorHandler.handleNotFound(res);

    try {
      const updatedItem = OrdersSchema.updateOrder().parse(req.body);
      this.list[index] = <OrderInterface><unknown>{
        id,
        ...updatedItem,
      };
      SuccessHandler.handleOk(res);
    } catch (error) {
      ErrorHandler.handleBadRequest(res, error.message);
    }
  }

  private static remove(req: Request, res: Response): void {
    const id = req.params.id;
    const index = this.list.findIndex(
      (item) => item.id === id
    );

    if (index === -1) return ErrorHandler.handleNotFound(res);

    this.list.splice(index, 1);
    SuccessHandler.handleOk(res);
  }

  private static exportToPDF(_req: Request, res: Response): void {
    const fontRegularPath = 'src/assets/fonts/roboto/Roboto-Regular.ttf';
    const fontBoldPath = 'src/assets/fonts/roboto/Roboto-Bold.ttf';

    const doc = new PDFDocument();

    doc.fontSize(18).font(fontBoldPath).text('Orders', { align: 'center' }).moveDown();
    doc.fontSize(11).font(fontRegularPath);


    this.list.forEach((order) => {
      const findVehicle = Vehicles.list.find((vehicle) => vehicle.id === order.vehicleId);
      const findDriver = Drivers.list.find((driver) => driver.id === order.driverId);

      doc.text(`ID: ${order.id}`);
      doc.text(`Pickup Location: ${order.pickupLocation}`);
      doc.text(`Delivery Location: ${order.deliveryLocation}`);
      doc.text(`Cargo Description: ${order.cargoDescription}`);
      doc.text(`Pickup Time: ${order.pickupTime}`);
      doc.text(`Delivery Time: ${order.deliveryTime}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Vehicle Id: ${order.vehicleId}`);
      doc.text(`Driver Id: ${order.driverId}`);
      doc.text(`Vehicle: ${findVehicle.brand} ${findVehicle.model}`);
      doc.text(`Driver: ${findDriver.firstName} ${findDriver.lastName}`);
      doc.moveDown();
    });

    res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename=drivers-list.pdf');

    doc.pipe(res);
    doc.end();
  }

  private static exportToXLSX(_req: Request, res: Response): void {
    const workbook = new Excel.Workbook();

    workbook.creator = 'Fleet Manager App';
    workbook.lastModifiedBy = 'Fleet Manager App';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;

    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
      }
    ];
    const worksheet = workbook.addWorksheet('Orders');
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Pickup Location', key: 'pickupLocation' },
      { header: 'Delivery Location', key: 'deliveryLocation' },
      { header: 'Cargo Description', key: 'cargoDescription' },
      { header: 'Pickup Time', key: 'pickupTime' },
      { header: 'Delivery Time', key: 'deliveryTime' },
      { header: 'Status', key: 'status' },
      { header: 'Vehicle Id', key: 'vehicleId' },
      { header: 'Driver Id', key: 'driverId' },
      { header: 'Vehicle', key: 'vehicle' },
      { header: 'Driver', key: 'driver' },
    ];

    this.list.forEach(({
       id,
       pickupLocation,
       deliveryLocation,
       cargoDescription,
       pickupTime,
       deliveryTime,
       status,
       vehicleId,
       driverId,
    }) => {
      const findVehicle = Vehicles.list.find((vehicle) => vehicle.id === vehicleId);
      const findDriver = Drivers.list.find((driver) => driver.id === driverId);

      worksheet.addRow({
        id,
        pickupLocation,
        deliveryLocation,
        cargoDescription,
        pickupTime,
        deliveryTime,
        status,
        vehicleId,
        driverId,
        vehicle: `${findVehicle.brand} ${findVehicle.model}`,
        driver: `${findDriver.firstName} ${findDriver.lastName}`,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');
    workbook.xlsx.write(res)
      .then(function () {
        res.end();
      });
  }
}
