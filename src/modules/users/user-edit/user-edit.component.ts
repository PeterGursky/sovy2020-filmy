import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/entities/group';
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
  allGroups: Group[] = [];

  userEditForm = new FormGroup({
    username: new FormControl('', 
                              [Validators.required, Validators.minLength(3)],
                              this.serverConflictsValidator('name')),
    email: new FormControl('', 
                           [Validators.required, 
                            Validators.email,
                            Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")],
                           this.serverConflictsValidator('email')),
    password: new FormControl(''),
    active: new FormControl(true),
    groups: new FormArray([])
  });

  constructor(private route: ActivatedRoute, private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.user = data.user;
        this.username.setValue(this.user.name);
        this.email.setValue(this.user.email);
        this.active.setValue(this.user.active);
        this.usersService.getGroups().subscribe( groups => {
          this.allGroups = groups;
          groups.forEach( group => {
            if (this.user.groups.some(ug => ug.id === group.id)) {
              this.groups.push(new FormControl(true));
            } else {
              this.groups.push(new FormControl(false));
            }
          });
        });
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
  get active(): FormControl {
    return this.userEditForm.get('active') as FormControl;
  }
  get groups(): FormArray {
    return this.userEditForm.get('groups') as FormArray;
  }

  onSubmit() {
    const userToSave = new User(
      this.username.value,
      this.email.value,
      this.user.id,
      undefined,
      this.active.value,
      this.allGroups.filter((_group, i) => this.groups.at(i).value),
      this.password.value.trim() ? this.password.value.trim(): null
    );
    this.usersService.saveUser(userToSave).subscribe(_user => this.router.navigateByUrl("/users/list"));
  }

  serverConflictsValidator(inputName: string): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors> => {
      const name = inputName === 'name' ? control.value: "";
      const email = inputName === 'email' ? control.value: "";
      const user = this.user.id ? new User(name,email,this.user.id) : new User(name,email);
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
