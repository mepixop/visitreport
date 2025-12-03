export class User {
  id: number;
  username: string;
  password: string;

  constructor(id: number, name: string, password: string) {
    this.id = id;
    this.username = name;
    this.password = password;
  }
}
