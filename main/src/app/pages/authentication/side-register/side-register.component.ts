import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';



import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html'
})
export class AppSideRegisterComponent {

  selected = 'USER';

  signupForm: FormGroup;

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: LoginService,
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],

    });
  }

  onFileSelected(){

  }

  showSuccessSnackbar() {
    this.snackBar.open('Sign Up Successful', 'Close', {
      duration: 1000,
      panelClass: 'app-notification-success',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  showErrorSnackbar() {
    this.snackBar.open('ERROR Sign Up', 'Close', {
      duration: 1000,
      panelClass: 'app-notification-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  errorSnackbarEmail() {
    this.snackBar.open('Email already exists', 'Close', {
      duration: 1000,
      panelClass: 'app-notification-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.signupForm.markAllAsTouched();
      return;
    }
    if (this.signupForm.valid) {
      // Handle form submission logic here
      const signupData = this.signupForm.value;

      console.log(signupData)

      this.authService.signUp(signupData).subscribe(
        response => {
          console.log('Successfully created account:', response);
          if(response.isOk == false){
              this.errorSnackbarEmail();
          }else if (response.isOk == true) {
            this.showSuccessSnackbar();
          }
        },
        error => {
          console.error('Erreur d\'inscription : ', error);
          this.showErrorSnackbar();
        }
      )

    } else {
      this.showErrorSnackbar();
    }
  }

}
