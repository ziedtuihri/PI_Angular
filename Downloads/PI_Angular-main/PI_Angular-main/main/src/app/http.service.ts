import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class HttpService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // Use environment.ts for API URL configuration
    this.apiUrl = environment.apiUrl || 'http://localhost:8080'; // Default to your Spring Boot URL
  }

  // GET request
  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.createHttpParams(params);
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }

  // POST request
  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  // PUT request
  put<T>(endpoint: string, id: string | number, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, body);
  }

  // DELETE request
  delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  // Helper method to convert object to HttpParams
  private createHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return httpParams;
  }
}
