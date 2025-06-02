// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { jwtDecode, InvalidTokenError } from 'jwt-decode';

// Define an interface for the decoded token payload
interface DecodedToken {
  fullName: string;
  sub: string; // Typically the email or username
  iat: number;
  exp: number;
  authorities: string[]; // This array should contain the roles, e.g., ["ROLE_USER", "ROLE_TEACHER"]
}

@Injectable({
  providedIn: 'root', // Make it a root-provided service
})
export class AuthService {
  constructor() {}

  // Get the JWT token from local storage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decode the token and return its payload
  private getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded;
      } catch (error) {
        if (error instanceof InvalidTokenError) {
          console.error('Error decoding token: Invalid or malformed token.', error);
        } else {
          console.error('An unexpected error occurred while decoding the token:', error);
        }
        // Invalidate token in storage if it's malformed
        localStorage.removeItem('token'); // Clear invalid token
        return null;
      }
    }
    return null;
  }

  // Public method to retrieve roles from the decoded token
  public getRoles(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.authorities || [] : [];
  }

  // Check if the current user has a specific role
  // Assumes Spring Security prefixes roles with "ROLE_" (e.g., "ROLE_USER", "ROLE_TEACHER")
  public hasRole(roleName: string): boolean {
    const roles = this.getRoles();
    const prefixedRoleName = 'ROLE_' + roleName.toUpperCase();
    return roles.includes(prefixedRoleName);
  }

  // Convenience methods for common role checks
  public isTeacherOrHR(): boolean {
    return this.hasRole('TEACHER') || this.hasRole('HR_COMPANY');
  }

  public isTeacher(): boolean {
    return this.hasRole('TEACHER');
  }

  public isStudent(): boolean {
    return this.hasRole('USER'); // Assuming "USER" role for students
  }

  // Get the connected user's email (subject from JWT)
  public getConnectedUserEmail(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.sub : null;
  }

  // Get the connected user's full name
  public getConnectedUserFullName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.fullName : null;
  }

  // Check if the token is valid and not expired
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      // Return true only if the token exists and is not expired
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token'); // Clear invalid token
      return false;
    }
  }

  // You might want a logout function here, or keep it in LoginService and call this one
  public logout(): void {
    localStorage.removeItem('token');
    // Consider also notifying LoginService if it observes authentication status
  }
}