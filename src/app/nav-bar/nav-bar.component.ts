import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from 'src/shared/auth.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
