import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginService } from 'src/app/services/login.service';

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  fullName: string;
  authorities: string[];
  [key: string]: any;
}


@Component({
  selector: 'app-change-role',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-role.component.html'
})
export class ChangeRoleComponent {

  changeRole: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: LoginService
  ) {
    this.changeRole = this.fb.group({
      role: ['', Validators.required] // Role field is required
    });
  }

  onSubmit() {
    if (this.changeRole.invalid) {
      return;
    }
    console.log("Form Submitted", this.changeRole.value);

            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
        
            // Decode the token
            if (token) {
              const decodedToken: DecodedToken = jwtDecode(token);
              console.log(decodedToken);
        
              // Print email, role, and full name
              console.log('Email:', decodedToken.sub);
              console.log('Full Name:', decodedToken.fullName);
              console.log('Role:', decodedToken.authorities[0]);

              this.authService.changeRole(decodedToken.sub, this.changeRole.value.role).subscribe({
                next: (response) => {
                  console.log('Role changed successfully:', response);
                  if(response.roleName === 'ROLE_ASSIGNED') {
                    this.router.navigate(['/dashboard']);
                  }
                  
                },
                error: (error) => {
                  console.error('Error changing role:', error);
                }
              });

            }

    


  }

}
