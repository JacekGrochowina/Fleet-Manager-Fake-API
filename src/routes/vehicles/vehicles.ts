import { Server } from '../../base/base.js';
import { VehiclesRoutes } from './vehicles-routes.js';
import { Request, Response } from 'express';
import { VehicleInterface, VEHICLES_DATA } from './vehicles-data.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { VehicleSchema } from './schemas/vehicle.schema.js';
import { v4 as uuidv4 } from 'uuid';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import { DelayHandler } from '../../shared/services/delay-handler.js';
import { ApiParamsBuilder } from '../../shared/services/api-params-builder.js';
import PDFDocument from 'pdfkit';
import Excel from 'exceljs';

export class Vehicles {
  public static list: VehicleInterface[] = VEHICLES_DATA;

  public static routes(): void {
    Server.createEndpoint('GET',
      VehiclesRoutes.getList(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.getList(req, res)),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.getDetails(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.getDetails(req, res)),
    );

    Server.createEndpoint('POST',
      VehiclesRoutes.add(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.add(req, res)),
    );

    Server.createEndpoint('PUT',
      VehiclesRoutes.update(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.update(req, res)),
    );

    Server.createEndpoint('DELETE',
      VehiclesRoutes.remove(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.remove(req, res)),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.exportToPDF(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToPDF(req, res)),
    );

    Server.createEndpoint('GET',
      VehiclesRoutes.exportToXLSX(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToXLSX(req, res)),
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
      const newItem = VehicleSchema.vehicle().parse({
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
      const updatedItem = VehicleSchema.updateVehicle().parse(req.body);
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

    doc.fontSize(18).font(fontBoldPath).text('Lista pojazdów', { align: 'center' }).moveDown();
    doc.fontSize(11).font(fontRegularPath);

    this.list.forEach((vehicle) => {
      doc.text(`ID: ${vehicle.id}`);
      doc.text(`Marka: ${vehicle.brand}`);
      doc.text(`Model: ${vehicle.model}`);
      doc.text(`Rok produkcji: ${vehicle.year}`);
      doc.text(`Numer rejestracyjny: ${vehicle.registrationNumber}`);
      doc.text(`Typ: ${vehicle.type}`);
      doc.text(`Status: ${vehicle.status}`);
      doc.text(`Kierowca: ${vehicle.driverId}`);
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
    const worksheet = workbook.addWorksheet('Pojazdy');
    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Marka', key: 'brand' },
      { header: 'Model', key: 'model' },
      { header: 'Rok produkcji', key: 'year' },
      { header: 'Numer rejestracyjny', key: 'registrationNumber' },
      { header: 'Typ: prawa jazdy', key: 'type' },
      { header: 'Status', key: 'status' },
      { header: 'Kierowca', key: 'driverId' },
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
      worksheet.addRow({
        id,
        brand,
        model,
        year,
        registrationNumber,
        type,
        status,
        driverId,
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
