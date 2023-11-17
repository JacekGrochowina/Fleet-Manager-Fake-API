export class AuthRoutes {
  private static root = 'auth';

  public static register = () => `/${this.root}/register`;
  public static login = () => `/${this.root}/login`;
}
