import { Server } from '../../base/base.js';
import { Request, Response } from 'express';
import { DelayHandler } from '../../shared/services/delay-handler.js';
import { ApiParamsBuilder } from '../../shared/services/api-params-builder.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { v4 as uuidv4 } from 'uuid';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import { DriverInterface, DRIVERS_DATA } from './drivers-data.js';
import { DriversRoutes } from './drivers-routes.js';
import { DriverSchema } from './schemas/driver.schema.js';
import { Vehicles } from '../vehicles/index.js';
import PDFDocument from 'pdfkit';
import Excel from 'exceljs';

export class Drivers {
  public static list: DriverInterface[] = DRIVERS_DATA;

  public static routes(): void {
    Server.createEndpoint('GET',
      DriversRoutes.getList(),
      (req: Request, res: Response) => this.getList(req, res)
    );

    Server.createEndpoint('GET',
      DriversRoutes.getDetails(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.getDetails(req, res)),
    );

    Server.createEndpoint('POST',
      DriversRoutes.add(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.add(req, res)),
    );

    Server.createEndpoint('PUT',
      DriversRoutes.update(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.update(req, res)),
    );

    Server.createEndpoint('DELETE',
      DriversRoutes.remove(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.remove(req, res)),
    );

    Server.createEndpoint('GET',
      DriversRoutes.exportToPDF(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToPDF(req, res)),
    );

    Server.createEndpoint('GET',
      DriversRoutes.exportToXLSX(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToXLSX(req, res)),
    );
  }

  private static getList(req: Request, res: Response): void {
    const builtResponse = ApiParamsBuilder.buildList(this.list, req);
    res.json(builtResponse);
  }

  private static getDetails(req: Request, res: Response): void {
    const foundItem: DriverInterface = this.list.find(
      (vehicle) => vehicle.id === req.params.id
    );

    foundItem
      ? res.json(foundItem)
      : ErrorHandler.handleNotFound(res);
  }

  private static add(req: Request, res: Response): void {
    try {
      const newItem = DriverSchema.driver().parse({
        id: uuidv4(),
        ...req.body,
      });
      this.list.push(<DriverInterface><unknown>newItem);
      SuccessHandler.handleCreated(res);
    } catch (error) {
      ErrorHandler.handleBadRequest(res, error.message);
    }
  }

  private static update(req: Request, res: Response): void {
    const id = req.params.id;
    const index = this.list.findIndex(
      (driver) => driver.id === id
    );

    if (index === -1) return ErrorHandler.handleNotFound(res);

    try {
      const updatedItem = DriverSchema.updateDriver().parse(req.body);
      this.list[index] = <DriverInterface><unknown>{ id, ...updatedItem };
      SuccessHandler.handleOk(res);
    } catch (error) {
      ErrorHandler.handleBadRequest(res, error.message);
    }
  }

  private static remove(req: Request, res: Response): void {
    const id = req.params.id;
    const index = this.list.findIndex(
      (driver) => driver.id === id
    );

    if (index === -1) return ErrorHandler.handleNotFound(res);

    this.list.splice(index, 1);

    const modifiedVehicles = Vehicles.list.map((vehicle) =>
      vehicle.driverId === id
        ? { ...vehicle, driverId: null }
        : vehicle
    );
    Vehicles.list = modifiedVehicles;

    SuccessHandler.handleOk(res);
  }

  private static exportToPDF(_req: Request, res: Response): void {
    const fontRegularPath = 'src/assets/fonts/roboto/Roboto-Regular.ttf';
    const fontBoldPath = 'src/assets/fonts/roboto/Roboto-Bold.ttf';

    const doc = new PDFDocument();

    doc.fontSize(18).font(fontBoldPath).text('Lista kierowców', { align: 'center' }).moveDown();
    doc.fontSize(11).font(fontRegularPath);

    this.list.forEach((driver) => {
      doc.text(`ID: ${driver.id}`);
      doc.text(`Imię: ${driver.firstName}`);
      doc.text(`Nazwisko: ${driver.lastName}`);
      doc.text(`Telefon: ${driver.phoneNumber}`);
      doc.text(`Email: ${driver.email}`);
      doc.text(`Numer prawa jazdy: ${driver.drivingLicenseNumber}`);
      doc.text(`Data urodzin: ${driver.birthDate}`);
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
    const worksheet = workbook.addWorksheet('Kierowcy');
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Imię', key: 'firstName' },
      { header: 'Nazwisko', key: 'lastName' },
      { header: 'Telefon', key: 'phoneNumber' },
      { header: 'Email', key: 'email' },
      { header: 'Numer prawa jazdy', key: 'drivingLicenseNumber' },
      { header: 'Data urodzin', key: 'birthDate' },
    ];

    this.list.forEach(({
     id,
     firstName,
     lastName,
     phoneNumber,
     email,
     birthDate,
     drivingLicenseNumber
    }) => {
      worksheet.addRow({
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        birthDate,
        drivingLicenseNumber,
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
