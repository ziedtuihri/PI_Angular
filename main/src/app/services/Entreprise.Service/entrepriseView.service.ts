import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Entreprise } from 'src/app/models/entreprise.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseViewService {
  // Base URL for API calls
  private baseUrl = `${environment.apiUrl}/entreprises`;

  // Default HTTP headers
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get the profile of an entreprise by ID.
   * @param id ID of the entreprise
   * @returns Observable<Entreprise>
   */
  getProfile(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update entreprise profile.
   * @param id ID of the entreprise
   * @param updatedData Updated entreprise data
   * @returns Observable<Entreprise>
   */
  updateProfile(id: number, updatedData: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.baseUrl}/${id}`, updatedData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete entreprise account.
   * @param id ID of the entreprise
   * @returns Observable<void>
   */
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle errors from HTTP requests.
   * Logs the error and throws a user-friendly message.
   * @param error The HTTP error response
   * @returns Error observable
   */
  private handleError(error: any): Observable<never> {
    console.error('EntrepriseViewService error:', error);
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server error ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
