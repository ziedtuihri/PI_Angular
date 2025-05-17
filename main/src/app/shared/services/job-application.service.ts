import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobApplication } from '../models/job-application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:1/api/applications';

  constructor(private http: HttpClient) {}

  getAllApplications() : Observable<JobApplication[]>{
    return this.http.get<JobApplication[]>(`${this.apiUrl}`)
  }

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

  // Updated download method to use the new secure endpoint
  downloadFile(applicationId: number, fileType: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/download/${fileType}`, {
      responseType: 'blob'
    });
  }

  // Keep this for backward compatibility if needed
  downloadFileByPath(path: string): Observable<Blob> {
    console.warn('Using deprecated download method');
    return this.http.get(`${this.apiUrl}/download?path=${encodeURIComponent(path)}`, {
      responseType: 'blob'
    });
  }


  // debug upload download 
  // Add this method to get a single application by ID
  getApplicationById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }
  
  // Add a method to update just the score
  updateScore(applicationId: number, score: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${applicationId}/score`, { score });
  }
}
