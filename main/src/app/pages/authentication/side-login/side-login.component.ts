import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ParseSourceFile } from '@angular/compiler';
import { LoginService } from '../../../services/login.service';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

// Extend the Window interface
declare global {
  interface Window {
    googleSDKLoaded: () => void;
    gapi: any; // You can replace 'any' with a more specific type if available
  }
}

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {

  loginForm: FormGroup;
  // authService: LoginService;

  title = 'loginGoogle';
      
  auth2: any;
      
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;

  ngOnInit() {
    this.googleAuthSDK();
  }

  constructor(
    private router: Router,
     private fb: FormBuilder,
      private authService: LoginService,
          private snackBar: MatSnackBar,  
     ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

    /**
   * Write code on Method
   *
   * @return response()
   */
    callLoginButton() {
       
      this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
        (googleAuthUser:any) => {
         
          let profile = googleAuthUser.getBasicProfile();
          console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
          console.log('ID: ' + profile.getId());
          console.log('Name: ' + profile.getName());
          console.log('Image URL: ' + profile.getImageUrl());
          console.log('Email: ' + profile.getEmail());
                
         /* Write Your Code Here */
        
        }, (error:any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
     
    }



  showSuccessSnackbar() {
    this.snackBar.open('Loing Successful', 'Close', {
      duration: 1000,
      panelClass: 'app-notification-success',
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  showErrorSnackbar() {
    this.snackBar.open('Invalid account', 'Close', {
      duration: 1000,
      panelClass: 'app-notification-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginData = this.loginForm.value;
      // console.log(loginData.email, loginData.password);

      this.authService.logIn(email, password).subscribe(response => {
        console.log(response)
        if (response.isOK == true) {
          this.showSuccessSnackbar();
          this.router.navigate(['/dashboard']);
        } else if (response.isOK == false) {
          this.showErrorSnackbar();
        }
      });
    }
    //this.router.navigate(['']);
  }

  

    /**
   * Write code on Method
   *
   * @return response()
   */
    googleAuthSDK() {
       
      (window)['googleSDKLoaded'] = () => {
        (window)['gapi'].load('auth2', () => {
          this.auth2 = (window)['gapi'].auth2.init({
            client_id: 'GOOGLE_CLIENT_ID',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          });
          this.callLoginButton();
        });
      }
         
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); 
        js.id = id;
        js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
        fjs?.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'google-jssdk'));
       
    }
}