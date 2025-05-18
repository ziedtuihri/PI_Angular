import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoginService } from '../../../services/login.service';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ParseSourceFile } from '@angular/compiler';

import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-activate-account',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './activate-account.component.html'
})
export class ActivateAccountComponent implements OnInit {

  token: string = "";

  constructor(private route: ActivatedRoute,
    private authService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token:', this.token);
    });


    this.authService.activationCode(this.token).subscribe(response => {
        console.log(response)
        if (response.isOk == true) {
          console.log("hi :::")
          this.showSuccessSnackbar();
            this.router.navigate(['/authentication/login']);
        } else if (response.isOk == false) {
          this.showErrorSnackbar();
        }
      });

  }


    showSuccessSnackbar() {
    this.snackBar.open('Account activated Successful', 'Close', {
      duration: 1500,
      panelClass: 'app-notification-success',
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  showErrorSnackbar() {
    this.snackBar.open('Invalid code', 'Close', {
      duration: 1500,
      panelClass: 'app-notification-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
