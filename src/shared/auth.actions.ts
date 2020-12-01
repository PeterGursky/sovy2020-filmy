import { Auth } from 'src/entities/auth';

export class Login {
  static readonly type = "[Login Page] login";
  constructor(public auth:Auth ){}
}

export class Logout {
  static readonly type="[NavBar Component] logout";
}