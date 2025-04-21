import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobApplication } from '../models/job-application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:8082/api/applications';

  constructor(private http: HttpClient) {}

  apply(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }

  getByOffer(offerId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/by-offer/${offerId}`);
  }

  getByStudent(studentId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/by-student/${studentId}`);
  }

  uploadFiles(applicationId: number, formData: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/${applicationId}/upload`, formData, { responseType: 'text' });
  }

  downloadFile(path: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download?path=${encodeURIComponent(path)}`, {
      responseType: 'blob'
    });
  }
}
