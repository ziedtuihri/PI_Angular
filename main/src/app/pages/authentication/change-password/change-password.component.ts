import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ParseSourceFile } from '@angular/compiler';
import { LoginService } from '../../../services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePwdForm: FormGroup;
  
        constructor(
          private router: Router,
           private fb: FormBuilder,
            private authService: LoginService,
                private snackBar: MatSnackBar,  
                
           ) {
            this.changePwdForm = this.fb.group({
              pwd1: ['', Validators.required],
              pwd2: ['', Validators.required]
            }, { validator: this.passwordMatchValidator
            });
        }

        passwordMatchValidator(formGroup: FormGroup) {
          return formGroup.get('pwd1')!.value === formGroup.get('pwd2')!.value
            ? null
            : { mismatch: true };
        }

        showSuccessSnackbar(msg: string) {
          this.snackBar.open(msg, 'Close', {
            duration: 2000,
            panelClass: 'app-notification-success',
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      
        showErrorSnackbar(msg: string) {
          this.snackBar.open(msg, 'Close', {
            duration: 2000,
            panelClass: 'app-notification-error',
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }

        onSubmit() {

          if (this.changePwdForm.valid) {
            const { pwd1, pwd2 } = this.changePwdForm.value;
            console.log('Passwords match:', pwd1 === pwd2);

            this.authService.changePassword(pwd1, "708412", "ziedtuihri@gmail.com").subscribe(response => {
              console.log(response)
              
              if(response.message == "Invalid code"){
                this.showErrorSnackbar("Invalid Code");
              }
  
              if(response.message == "Activation code has expired") {
                this.showErrorSnackbar("Activation code has expired");
              }
  
              if(response.message == "password changed") {
                this.showSuccessSnackbar("Password Changed");
                this.router.navigate(['/authentication/login']);
              }
  
            });
          }

        }
}
