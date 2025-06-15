import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobApplication } from '../models/job-application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:8081/api/applications';

  constructor(private http: HttpClient) {}

  // Get all applications
  getAllApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}`);
  }

  // Submit a new application
  apply(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }

  // Get applications by offer
  getByOffer(offerId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/by-offer/${offerId}`);
  }

  // Get applications by student email
  getByStudentEmail(email: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/by-student-email/${email}`);
  }

  // Upload documents
  uploadFiles(applicationId: number, formData: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/${applicationId}/upload`, formData, {
      responseType: 'text'
    });
  }

  // Download a file by type (cv, coverletter, certificates)
  downloadFile(applicationId: number, fileType: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/download/${fileType}`, {
      responseType: 'blob'
    });
  }

  // Deprecated fallback for manual path download (optional)
  downloadFileByPath(path: string): Observable<Blob> {
    console.warn('Using deprecated download method');
    return this.http.get(`${this.apiUrl}/download?path=${encodeURIComponent(path)}`, {
      responseType: 'blob'
    });
  }

  // Get a specific application
  getApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  // Update score only
  updateScore(applicationId: number, score: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${applicationId}/score`, { score });
  }

  // Schedule interview (Whereby API)
  scheduleInterview(applicationId: number, data: { start: string, end: string }): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${applicationId}/schedule-interview`, data);
  }

  // ✅ TODO: Update application status (approved/rejected)
  updateApplicationStatus(applicationId: number, status: string): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${applicationId}/status`, { status });
  }
}
