import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Auth } from 'src/entities/auth';
import { Login } from 'src/shared/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  auth = new Auth();
  
  constructor(private store:Store) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(JSON.stringify(this.auth));
    this.store.dispatch(new Login(this.auth));
  }
}
