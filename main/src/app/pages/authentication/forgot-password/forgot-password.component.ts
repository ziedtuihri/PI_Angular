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
  selector: 'app-forgot-password',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

      constructor(
        private router: Router,
         private fb: FormBuilder,
          private authService: LoginService,
              private snackBar: MatSnackBar,  
              
         ) {
          this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
          });
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
        if (this.forgotPasswordForm.valid) {

          const { email } =  this.forgotPasswordForm.value;
          //const email = this.forgotPasswordForm.value;
          console.log(email);
          
          this.authService.checkEmail(email).subscribe(response => {
            
            if(response.message == "Invalid email"){
              this.showErrorSnackbar("Invalid Mail");
            }

            if(response.message == "Activate your account") {
              this.showErrorSnackbar("Activate your account");
            }

            if(response.message == "Code sent") {
              this.showSuccessSnackbar("Check your mail code sent");

              this.router.navigate(['/authentication/verificationCode']);
            }

          }
            
          )

          // Proceed with further processing or API call
        }
      }

}
