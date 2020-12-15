import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/entities/user';
import { UsersService } from 'src/services/users.service';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', 
                              [Validators.required, Validators.minLength(3)],
                              this.serverConflictsValidator('name')),
    email: new FormControl('', 
                           [Validators.required, 
                            Validators.email,
                            Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")],
                           this.serverConflictsValidator('email')),
    password: new FormControl('', [Validators.required, 
                                   this.passwordValidator()]),
    password2: new FormControl('', Validators.required)
  }, this.passwordsMatchValidator);

  hide = true;
  passwordMessage = "";

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
  }

  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get password2(): FormControl {
    return this.registerForm.get('password2') as FormControl;
  }

  onSubmit() {
    const user = new User(this.username.value, 
                          this.email.value, 
                          undefined, // id
                          undefined, // lastLogin
                          undefined, // active
                          [],        // groups
                          this.password.value);
    this.usersService.register(user).subscribe(u => {
      this.router.navigateByUrl("/login");
    })
  }

  getErrors(model: AbstractControl) {
    return JSON.stringify(model.errors);
  }

  passwordValidator(): ValidatorFn {
    return (model: FormControl): ValidationErrors => {
      const result = zxcvbn(model.value);
      this.passwordMessage = "Password strength: " + result.score + "/4 " + 
      (result.score < 3 ? "- must be 3 or 4, ": "") +
      result.feedback.warning + ' ' + result.feedback.suggestions +
      ", crackable in " + result.crack_times_display.offline_slow_hashing_1e4_per_second;
      return result.score > 2 ? null : { weakPassword: this.passwordMessage };
    }
  }

  passwordsMatchValidator(model: FormGroup): ValidationErrors {
    const password = model.get('password');
    const password2 = model.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      const error = { differentPasswords: 'Passwords do not match'};
      password2.setErrors(error);
      return error;
    }
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
