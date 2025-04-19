import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  loginForm: FormGroup;
  // authService: LoginService;

  constructor(private readonly router: Router, private readonly fb: FormBuilder, private readonly authService: LoginService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginData = this.loginForm.value;
      // console.log(loginData.email, loginData.password);

      this.authService.logIn(email, password).subscribe((response:any) => {
        if (!response.success) {
        }
      });
    }
    //this.router.navigate(['']);
  }
}