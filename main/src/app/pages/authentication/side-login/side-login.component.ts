import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(8)]],
      motPasse: ['', [Validators.required]]
    });
  }

  // constructor(private router: Router) {}

/*   form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required]),
  }); */

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {

    if(this.loginForm.valid){
      const { uname, password } = this.loginForm.value;

      console.log(uname + password)

    }


    //this.router.navigate(['']);
  }
}
