import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User>{

  constructor(private usersService: UsersService) { }
  
  resolve(route: ActivatedRouteSnapshot, 
          state: RouterStateSnapshot): User | Observable<User> {
    if (route.paramMap.has('id')) {
      const id = route.paramMap.get('id');
      return this.usersService.getUser(+id);
    } else {
      return new User("","");
    }
  }
}
