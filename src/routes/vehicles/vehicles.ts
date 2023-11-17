import { Server } from '../../base/base.js';
import { VehiclesRoutes } from './vehicles-routes.js';
import { Request, Response } from 'express';
import { VehicleInterface, VEHICLES_DATA } from './vehicles-data.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { VehiclesSchema } from './vehicles-schema.js';
import { v4 as uuidv4 } from 'uuid';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import { ApiParamsBuilder } from '../../shared/services/api-params-builder.js';
import PDFDocument from 'pdfkit';
import Excel from 'exceljs';
import { Drivers } from '../drivers/drivers.js';

export class Vehicles {
  public static list: VehicleInterface[] = VEHICLES_DATA;

  public static routes(): void {
    Server.createEndpoint('GET',
      VehiclesRoutes.getList(),
      (req: Request, res: Response) => this.getList(req, res),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.getDetails(),
      (req: Request, res: Response) => this.getDetails(req, res),
    );

    Server.createEndpoint('POST',
      VehiclesRoutes.add(),
      (req: Request, res: Response) => this.add(req, res),
    );

    Server.createEndpoint('PUT',
      VehiclesRoutes.update(),
      (req: Request, res: Response) => this.update(req, res),
    );

    Server.createEndpoint('DELETE',
      VehiclesRoutes.remove(),
      (req: Request, res: Response) => this.remove(req, res),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.exportToPDF(),
      (req: Request, res: Response) => this.exportToPDF(req, res),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.exportToXLSX(),
      (req: Request, res: Response) => this.exportToXLSX(req, res),
    );
  }

  private static getList(req: Request, res: Response): void {
    const builtResponse = ApiParamsBuilder.buildList(this.list, req);
    res.json(builtResponse);
  }

  private static getDetails(req: Request, res: Response): void {
    const foundItem: VehicleInterface = this.list.find(
      (vehicle) => vehicle.id === req.params.id
    );

    foundItem
      ? res.json(foundItem)
      : ErrorHandler.handleNotFound(res);
  }

  private static add(req: Request, res: Response): void {
    try {
      const newItem = VehiclesSchema.vehicle().parse({
        id: uuidv4(),
        ...req.body,
      });
      this.list.push(<VehicleInterface><unknown>newItem);
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
      const updatedItem = VehiclesSchema.updateVehicle().parse(req.body);
      this.list[index] = <VehicleInterface><unknown>{ id, ...updatedItem };
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

    doc.fontSize(18).font(fontBoldPath).text('Vehicles', { align: 'center' }).moveDown();
    doc.fontSize(11).font(fontRegularPath);

    this.list.forEach((vehicle) => {
      const findDriver = Drivers.list.find((driver) => driver.id === vehicle.driverId);

      doc.text(`ID: ${vehicle.id}`);
      doc.text(`Brand: ${vehicle.brand}`);
      doc.text(`Model: ${vehicle.model}`);
      doc.text(`Year of Manufacture: ${vehicle.year}`);
      doc.text(`Registration Number: ${vehicle.registrationNumber}`);
      doc.text(`Type: ${vehicle.type}`);
      doc.text(`Status: ${vehicle.status}`);
      doc.text(`Driver Id: ${vehicle.driverId}`);
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
    const worksheet = workbook.addWorksheet('Vehicles');
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Brand', key: 'brand' },
      { header: 'Model', key: 'model' },
      { header: 'Year of Manufacture', key: 'year' },
      { header: 'Registration Number', key: 'registrationNumber' },
      { header: 'Type', key: 'type' },
      { header: 'Status', key: 'status' },
      { header: 'Driver Id', key: 'driverId' },
      { header: 'Driver', key: 'driver' },
    ];

    this.list.forEach(({
       id,
       brand,
       model,
       year,
       registrationNumber,
       type,
       status,
       driverId,
    }) => {
      const findDriver = Drivers.list.find((driver) => driver.id === driverId);

      worksheet.addRow({
        id,
        brand,
        model,
        year,
        registrationNumber,
        type,
        status,
        driverId,
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
