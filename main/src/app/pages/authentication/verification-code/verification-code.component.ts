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
  selector: 'app-verification-code',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verification-code.component.html'
})
export class VerificationCodeComponent {

  verificationCodeForm: FormGroup;
  
        constructor(
          private router: Router,
           private fb: FormBuilder,
            private authService: LoginService,
                private snackBar: MatSnackBar
           ) {
            this.verificationCodeForm = this.fb.group({
              verificationCode: ['', [Validators.required]]
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

          const { verificationCode } = this.verificationCodeForm.value;

          console.log(verificationCode);


          const emailReset = localStorage.getItem('emailReset') || 'null';

          console.log("email sent code to ::::", emailReset)
          
          this.authService.checkVerificationCode(verificationCode, emailReset).subscribe(response => {
            console.log(response)
            
            if(response.message == "Invalid code"){
              this.showErrorSnackbar("Invalid Code");
            }

            if(response.message == "Activation code has expired") {
              this.showErrorSnackbar("Activation code has expired");
            }

            if(response.message == "Code correct") {
              this.showSuccessSnackbar("Correct Code");
              localStorage.setItem('codeReset', verificationCode);
              this.router.navigate(['/authentication/ChangePwd']);

            }

          });

        }

}
