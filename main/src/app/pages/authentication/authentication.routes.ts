import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ActivateAccountComponent } from "./activate-account/activate-account.component";
import { ChangeRoleComponent } from './change-role/change-role.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent,
      },
      {
        path: 'verificationCode',
        component: VerificationCodeComponent,
      },
      {
        path: 'ChangePwd',
        component: ChangePasswordComponent,
      },
        {
          path: 'activate-account',
          component: ActivateAccountComponent,
        },
              {
        path: 'ChangeRole',
        component: ChangeRoleComponent,
      }
    ],
  },
];
