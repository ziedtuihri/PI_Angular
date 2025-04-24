import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JobApplication } from 'src/app/shared/models/job-application';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';

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
  const studentId = 0; // TODO: Replace with actual logged-in user
  this.appService.getByStudent(studentId).subscribe(data => this.applications = data);
}

}
