import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
import { Observable, of, BehaviorSubject, map, catchError } from 'rxjs';


import { jwtDecode } from 'jwt-decode';

@Injectable()
export class LoginService {

  private readonly isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router, private http:HttpClient){}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  logIn(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8082/auth/authenticate', { email, password })
      .pipe(
        map(response => {
          console.log("working");
          localStorage.setItem('token', response.token);
          console.log(response.token)
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/dashboard']);
          return { success: true, message: 'WELCOM TO PI DEV' };;
        }),
        catchError(error => {
          console.log("error");
          let message = 'Unknown error occurred';
          if (error.status === 404) {
            message = 'User not found';
          } else if (error.status === 400) {
            message = 'Invalid email or password, vérifier si vos coordonnées sont exactes';
          } else if (error.error.message === 'Invalid mot de passe') {
            message = 'Invalid password';
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

}