import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JobApplication } from 'src/app/shared/models/job-application';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  fullName: string;
  sub: string; // email
  iat: number;
  exp: number;
  authorities: string[];
}
@Component({
  selector: 'app-student-applications',
  imports: [CommonModule],
  templateUrl: './student-applications.component.html',
  styleUrl: './student-applications.component.scss'
})
export class StudentApplicationsComponent {
  applications: JobApplication[] = [];

  constructor(private appService: JobApplicationService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      const email = decoded.sub;

      this.appService.getByStudentEmail(email).subscribe({
        next: (data) => this.applications = data,
        error: (err) => console.error('Failed to load applications', err)
      });
    } else {
      console.error('Token not found in localStorage');
    }
  }

  getStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'APPROVED': return 'status-approved';
    case 'REJECTED': return 'status-rejected';
    case 'INTERVIEW': return 'status-interview';
    case 'NEW': default: return 'status-new';
  }
}

}
