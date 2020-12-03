import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UsersService } from 'src/services/users.service';
import { UrlAfterLogin } from 'src/shared/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private usersService: UsersService,
    private router: Router,
    private store: Store) {}
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("load strážca auth testuje URL " + route.path);
    return this.canAnything(route.path);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("activate strážca auth testuje URL " + state.url);
      return this.canAnything(state.url);
  }
  
  private canAnything(url: string): boolean | Observable<boolean> {
    if (this.store.selectSnapshot(state => state.auth.token)) {
      return true;
    }
    return this.store.dispatch(new UrlAfterLogin(url)).pipe(
      map(() => {
        this.router.navigateByUrl("/login");
        return false;
      })
    )
  }
}
