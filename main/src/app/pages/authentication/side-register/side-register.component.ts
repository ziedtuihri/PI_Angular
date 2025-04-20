import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';



import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
  styleUrl: './register.component.css'
})
export class AppSideRegisterComponent {

  signupForm: FormGroup;

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

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

  onSubmit() {
    if (this.signupForm.valid) {
      // Handle form submission logic here
      this.showSuccessSnackbar();
    } else {
      this.showErrorSnackbar();
    }
  }

}
