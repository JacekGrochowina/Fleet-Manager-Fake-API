import { OrderInterface, ORDERS_DATA } from './orders-data.js';
import { Server } from '../../base/base.js';
import { Request, Response } from 'express';
import { DelayHandler } from '../../shared/services/delay-handler.js';
import { OrdersRoutes } from './orders-routes.js';
import { ApiParamsBuilder } from '../../shared/services/api-params-builder.js';
import { ErrorHandler } from '../../shared/services/error-handler.js';
import { OrderSchema } from './schemas/order.schema.js';
import { v4 as uuidv4 } from 'uuid';
import { SuccessHandler } from '../../shared/services/success-handler.js';
import PDFDocument from 'pdfkit';
import Excel from 'exceljs';

export class Orders {
  public static list: OrderInterface[] = ORDERS_DATA;

  public static routes(): void {
    Server.app.get(
      OrdersRoutes.getList(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.getList(req, res)),
    );

    Server.app.get(
      OrdersRoutes.getDetails(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.getDetails(req, res)),
    );

    Server.app.post(
      OrdersRoutes.add(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.add(req, res)),
    );

    Server.app.put(
      OrdersRoutes.update(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.update(req, res)),
    );

    Server.app.delete(
      OrdersRoutes.remove(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.remove(req, res)),
    );

    Server.app.get(
      OrdersRoutes.exportToPDF(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToPDF(req, res)),
    );

    Server.app.get(
      OrdersRoutes.exportToXLSX(),
      (req: Request, res: Response) => DelayHandler.delay(() => this.exportToXLSX(req, res)),
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
      const newItem = OrderSchema.order().parse({
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
      const updatedItem = OrderSchema.updateOrder().parse(req.body);
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

    doc.fontSize(18).font(fontBoldPath).text('Lista zamówień', { align: 'center' }).moveDown();
    doc.fontSize(11).font(fontRegularPath);

    this.list.forEach((driver) => {
      doc.text(`ID: ${driver.id}`);
      doc.text(`Miejsce odbioru: ${driver.pickupLocation}`);
      doc.text(`Miejsce dostawy: ${driver.deliveryLocation}`);
      doc.text(`Opis ładunku: ${driver.cargoDescription}`);
      doc.text(`Czas odbioru: ${driver.pickupTime}`);
      doc.text(`Czas dostawy: ${driver.deliveryTime}`);
      doc.text(`Status: ${driver.status}`);
      doc.text(`Pojazd: ${driver.vehicleId}`);
      doc.text(`Kierowca: ${driver.driverId}`);
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
      { header: 'Miejsce odbioru', key: 'pickupLocation' },
      { header: 'Miejsce dostawy', key: 'deliveryLocation' },
      { header: 'Opis ładunku', key: 'cargoDescription' },
      { header: 'Czas odbioru', key: 'pickupTime' },
      { header: 'Czas dostawy', key: 'deliveryTime' },
      { header: 'Status', key: 'status' },
      { header: 'Pojazd', key: 'vehicleId' },
      { header: 'Kierowca', key: 'driverId' },
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
