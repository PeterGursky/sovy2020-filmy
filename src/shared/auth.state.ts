import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from 'src/services/users.service';
import { Login, Logout } from './auth.actions';

export interface AuthModel {
  username: string;
  token: string;
}

@State<AuthModel>({
  name: 'auth',
  defaults: {
    username: null,
    token: null
  }
})
@Injectable()
export class AuthState {

  constructor(private usersService: UsersService){}

  @Action(Login)
  login(ctx: StateContext<AuthModel>, action: Login): Observable<string> {
    return this.usersService.login(action.auth).pipe(
      tap(token => {
        ctx.setState({
          username: action.auth.name,
          token
        });           
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthModel>, action: Logout) {
    ctx.setState({
      username: null,
      token: null
    });
  }
}