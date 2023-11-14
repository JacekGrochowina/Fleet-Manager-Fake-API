export class DriversRoutes {
  private static root = 'drivers';

  public static getList = () => `/${this.root}`;
  public static getDetails = () => `/${this.root}/:id`;
  public static add = () => `/${this.root}/add`;
  public static update = () => `/${this.root}/update/:id`;
  public static remove = () => `/${this.root}/delete/:id`;
  public static exportToPDF = () => `/${this.root}/list/download/pdf`;
  public static exportToXLSX = () => `/${this.root}/list/download/xlsx`;
}
