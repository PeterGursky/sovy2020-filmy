import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User;
  hide = true;

  userEditForm = new FormGroup({
    username: new FormControl('', 
                              [Validators.required, Validators.minLength(3)],
                              this.serverConflictsValidator('name')),
    email: new FormControl('', 
                           [Validators.required, 
                            Validators.email,
                            Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")],
                           this.serverConflictsValidator('email')),
    password: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.user = data.user;
      }
    );
  }

  get username(): FormControl {
    return this.userEditForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.userEditForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.userEditForm.get('password') as FormControl;
  }
  
  serverConflictsValidator(inputName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const name = inputName === 'name' ? control.value: "";
      const email = inputName === 'email' ? control.value: "";
      const user = new User(name,email);
      return this.usersService.checkUserConflicts(user).pipe(
        map(conflictsArray => {
          if (conflictsArray.includes(inputName)) {
            return {conflictOnServer : 'already taken on server - choose another ' + inputName};
          } else {
            return null;
          }
        })
      );
    }
  }
}
