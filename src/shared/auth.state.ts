import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';
import { UsersService } from 'src/services/users.service';
import { Login, Logout, UrlAfterLogin } from './auth.actions';

const DEFAULT_REDIRECT_AFTER_LOGIN = "/users";

export interface AuthModel {
  username: string;
  token: string;
  redirectAfterLogin: string; 
}

@State<AuthModel>({
  name: 'auth',
  defaults: {
    username: null,
    token: null,
    redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN
  }
})
@Injectable()
export class AuthState {

  @Selector()
  static userName(state: AuthModel): string {
    return state.username;
  }

  @Selector([AuthState.userName])
  static userNameOnly(username: string): string {
    return username;
  }

  @Selector([state => state.auth.username])
  static userNameOnly2(username: string): string {
    return username;
  }

  @Selector()
  static urlAfterLogin(state: AuthModel) {
    return state.redirectAfterLogin;
  }

  constructor(private usersService: UsersService, 
              private snackbarService: SnackbarService){}

  ngxsOnInit(ctx: StateContext<AuthModel>) {
    const {token} = ctx.getState();
    this.usersService.checkToken(token).subscribe(
      ok => {
        if (!ok) {
          ctx.patchState({
            username: null,
            token: null
          });
        }
      }
    );
  }

  @Action(Login)
  login(ctx: StateContext<AuthModel>, action: Login): Observable<string> {
    return this.usersService.login(action.auth).pipe(
      tap(token => {
        ctx.patchState({
          username: action.auth.name,
          token
        });           
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthModel>, action: Logout) {
    const token = ctx.getState().token;
    ctx.patchState({
      username: null,
      token: null,
      redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN
    });
    this.snackbarService.successMessage("You have sucessfully logged out");
    if (token)
      return this.usersService.logout(token);
  }

  @Action(UrlAfterLogin)
  setUrl(ctx: StateContext<AuthModel>, action: UrlAfterLogin) {
    ctx.patchState({
      redirectAfterLogin: action.url
    });
  }
}