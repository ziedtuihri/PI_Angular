import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
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

import { User } from '../../../models/user';

import { jwtDecode } from 'jwt-decode';

// Extend the Window interface
/*
declare global {
  interface Window {
    googleSDKLoaded: () => void;
    gapi: any; // You can replace 'any' with a more specific type if available
  }
}
*/

// Extend the Window interface
declare global {
  interface Window {
    google: any; // You can replace 'any' with a more specific type if available
  }
}

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit, AfterViewInit {


  
  loginForm: FormGroup;
  // authService: LoginService;

  title = 'loginGoogle';
  isGoogleButtonRendered: boolean = false;
  auth2: any;
      
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;

  ngOnInit() {

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

  ngAfterViewInit() {
    // Ensure that the element exists before attaching the click handler
    if (this.loginElement) {
      this.callLoginButton();
    }
  }



  callLoginButton() {

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '421853907823-qg8v2akcfabrj2fiqqvtgsdh0sh5flg0.apps.googleusercontent.com',
        callback: (response: any) => {
          

           // Define a type for the decoded token
        type GoogleJwtPayload = {
          email?: string;
          name?: string;
          picture?: string;
          sub?: string;
          family_name?: string;
          given_name?: string;
          [key: string]: any;
        };

           // Decode the credential
        const decodedToken = jwtDecode<GoogleJwtPayload>(response.credential);

          // You can also access specific properties like this:
          console.log('Email:', decodedToken.email);
          console.log('Family Name:', decodedToken.family_name);
          console.log('Given Name:', decodedToken.given_name);

          const user: User = {
            email: decodedToken.email ?? '',
            firstname: decodedToken.given_name,
            lastname: decodedToken.family_name
          };
          

          // Handle the login with the retrieved profile information
          // For example, you can call a method in your LoginService to handle the Google Auth login
          this.authService.handleGoogleAuthLogin(user).subscribe(response => {
            console.log(response);
            if (response.isOK == true) {
             // this.showSuccessSnackbar();
              // this.router.navigate(['/dashboard']);
            } else if (response.isOK == false) {
              this.showErrorSnackbar();
            }
          });
        },
                locale: 'en' // Set the language to English

      });

      window.google.accounts.id.renderButton(
        this.loginElement.nativeElement,
        {
          theme: 'outline',
          size: 'large',
          locale: 'en',
          text: 'signin with' // This will set the button text to "Sign in with Google" in English
        }  // customization attributes
      );
      this.isGoogleButtonRendered = true;
    } else {
      console.error('Google Identity Services not initialized');
    }

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

  


}