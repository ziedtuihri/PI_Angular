import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
import { Observable, of, BehaviorSubject, map, catchError } from 'rxjs';
import { User } from '../models/user';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();



  constructor(private router: Router, private http:HttpClient){}


  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  logIn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8081/auth/authenticate`, { email, password })
      .pipe(
        map(response => {
          console.log(response)
          if(response.token == 'Invalid account!' || response.token == 'Invalid email or password') {
            return {isOK: false}
          }
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
          return { isOK: true };
        }),
        catchError(error => {
          console.log("error");
          let message = 'Unknown error occurred';
          if (error.status === 404) {
            message = 'User not found';
          } else if (error.status == 400) {
            message = 'Invalid email or password, vérifier si vos coordonnées sont exactes';
          } else if (error.error.message === 'Invalid mot de passe') {
            message = 'Invalid password';
          }
          return of({ success: false, message });
        })
      );
  }

    handleGoogleAuthLogin(user: User): Observable<any> {
    return this.http.post<any>('http://localhost:8081/auth/authenticateOption',  user ).pipe(
      map(response => {
        console.log("****** res : ",response);
        if (response.token == 'Invalid email or password' || response.token == 'Login with email and password') {
          return { isOK: false };
        }
        
        localStorage.setItem('token', response.token);
        this.isAuthenticatedSubject.next(true);
        return { isOK: true };
      }),
      catchError(error => {
        console.log("credentials for SPRING:: ", user)
        console.log("error");
        let message = 'Unknown error occurred';
        if (error.status === 404) { 
          message = 'User not found';
        } else if (error.status === 400) {
          message = 'Invalid token';
        }
        return of({ success: false, message });
      })
    );
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return true; // Vérifie si le token est valide
      } catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }
    }
    return false;
  }


  signUp(user: User): Observable<any> {
    return this.http.post<any>(`http://localhost:8081/auth/register`, user)
    .pipe(
      map(response => {
        // this.router.navigate(['/verify-email']);
        return { isOk: true };
      }),
      catchError(error => {
        return of({ isOk: false, message: "Failed to create account" });
      })
    );
  }

  checkEmail(email: string): Observable<any> {
    return this.http.post<any>('http://localhost:8081/auth/forgotPassword',  { email } )
      .pipe(
        map(response => {
          console.log(response);
          return { response };
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ message });
        })
      );
  }

  checkVerificationCode(codeReset: string, email: string): Observable<any> {
    const url = `http://localhost:8081/auth/resetPassword?codeReset=${codeReset}&email=${email}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          console.log(response);
          return { response };
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ message });
        })
      );
  }


    activationCode(code: string): Observable<any> {
    const url = `http://localhost:8081/auth/activate-account?token=${code}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          console.log(response);
          return { isOk: true };
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ isOk: false });
        })
      );
  }



  changePassword(password: string, code: string, email: string): Observable<any> {
    return this.http.post<any>('http://localhost:8081/auth/changePassword',  { password, code, email } )
      .pipe(
        map(response => {
          console.log(response);
          return { response };
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ message });
        })
      );
  }


    checkRole(email: string): Observable<any> {
    return this.http.post<any>('http://localhost:8081/auth/checkUserRole',  { email } )
      .pipe(
        map(response => {
          console.log(response.roleName);
          return response;
          
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ isOk: false });
        })
      );
  }

  changeRole(email: string, roleName: string): Observable<any> {
    return this.http.post<any>('http://localhost:8081/auth/changeUserRole',  { email, roleName } )
      .pipe(
        map(response => {
          console.log(response);
          return response;
          
        }),
        catchError(error => {
          const message = `${error?.error?.text || 'Unknown error'}`;
          console.error('Error:', message);
          return of({ isOk: false });
        })
      );
  }

}
