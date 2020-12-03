import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from 'src/shared/auth.actions';
import { AuthModel, AuthState } from 'src/shared/auth.state';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

//  loggedUser: string = null;

//  @Select(AuthState) authState$: Observable<AuthModel>;
//  @Select(state => state.auth.username) username$: Observable<string>;
  @Select(AuthState.userName) username$: Observable<string>;

  constructor(private store: Store) { }

  ngOnInit(): void {
//    this.authState$.subscribe(auth => this.loggedUser = auth.username);
//    this.username$.subscribe(username => this.loggedUser = username);
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
