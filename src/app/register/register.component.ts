import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/entities/user';
import * as zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, 
                                   Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, 
                                Validators.email,
                                Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
    password: new FormControl('', [Validators.required, 
                                   this.passwordValidator()]),
    password2: new FormControl('', Validators.required)
  });
  hide = true;
  passwordMessage = "";

  constructor() { }

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
    console.log("User: " + JSON.stringify(user));
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
}
