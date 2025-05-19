import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MessageDisplayComponent } from 'src/app/shared/components/message-display/message-display.component';
import { JobApplication } from 'src/app/shared/models/job-application';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { TestPreviewComponent } from '../test-preview/test-preview.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MessageDisplayComponent,
    TestPreviewComponent,
    PdfViewerComponent,
  ],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss',
})
export class ApplicationDetailsComponent {
  applicationId!: number;
  application?: JobApplication;

  // State and feedback
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  messageTimeout: any = null;

  // File preview logic
  previewUrls: { [key: string]: string } = {};
  activePreviewType: string | null = null;

  // Schedule modal
  showScheduleModal = false;
  scheduleData = {
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00'
  };

  constructor(
    private route: ActivatedRoute,
    private jobAppService: JobApplicationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadApplicationDetails();
  }

  // Load application from backend
  loadApplicationDetails(): void {
    this.isLoading = true;
    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.jobAppService.getApplicationById(this.applicationId).subscribe({
      next: (app) => {
        this.application = app;
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorMessage('Failed to load application details');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Download file logic
  downloadFile(fileType: string): void {
    this.jobAppService.downloadFile(this.applicationId, fileType).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.getDownloadFileName(fileType);
        link.click();
        URL.revokeObjectURL(link.href);
      },
      error: () => this.showErrorMessage('Could not download the file.')
    });
  }

  getDownloadFileName(fileType: string): string {
    return ({
      cv: 'CV.pdf',
      coverletter: 'CoverLetter.pdf',
      certificates: 'Certificates.pdf'
    })[fileType] || 'document.pdf';
  }

  // Preview file in modal
  previewFile(fileType: string): void {
    if (this.previewUrls[fileType]) {
      this.activePreviewType = fileType;
      return;
    }

    this.jobAppService.downloadFile(this.applicationId, fileType).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.previewUrls[fileType] = url;
        this.activePreviewType = fileType;
      },
      error: () => this.showErrorMessage('Could not preview the file.')
    });
  }

  closePreview(): void {
    this.activePreviewType = null;
  }

  getDocumentTitle(type: string): string {
    return ({
      cv: 'Curriculum Vitae',
      coverletter: 'Cover Letter',
      certificates: 'Certificates'
    })[type] || 'Document';
  }

  getStatusClass(status: string): string {
    return `status-${(status || 'new').toLowerCase()}`;
  }

  getScorePercentage(score: number): string {
    return `${Math.min(100, Math.max(0, score || 0))}%`;
  }

  // Interview scheduling logic
  scheduleInterview(): void {
    this.showScheduleModal = true;
    this.scheduleData = {
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00'
    };
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
  }

  confirmScheduleInterview(): void {
    const { date, startTime, endTime } = this.scheduleData;
    if (!date || !startTime || !endTime) {
      this.showErrorMessage('Please fill all fields.');
      return;
    }

    const isoDate = date.toISOString().split('T')[0];
    const startISO = `${isoDate}T${startTime}:00Z`;
    const endISO = `${isoDate}T${endTime}:00Z`;

    const now = new Date().toISOString();
    if (endISO <= now) {
      this.showErrorMessage('End time must be in the future.');
      return;
    }

    this.isLoading = true;
    this.jobAppService.scheduleInterview(this.applicationId, { start: startISO, end: endISO }).subscribe({
      next: (updatedApp) => {
        this.application = updatedApp;
        this.showSuccessMessage('Interview scheduled successfully.');
        this.closeScheduleModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorMessage('Failed to schedule interview.');
        console.error('Interview scheduling error:', err);
        this.isLoading = false;
      }
    });
  }

  // Message utilities
  showSuccessMessage(message: string, duration: number = 5000): void {
    this.clearMessages();
    this.successMessage = message;
    this.setMessageTimeout(duration);
  }

  showErrorMessage(message: string, duration: number = 5000): void {
    this.clearMessages();
    this.errorMessage = message;
    this.setMessageTimeout(duration);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  private setMessageTimeout(duration: number): void {
    this.messageTimeout = setTimeout(() => this.clearMessages(), duration);
  }

  updateApplicationStatus(status: string): void {
  if (!this.application) return;

  this.isLoading = true;
  this.jobAppService.updateApplicationStatus(this.applicationId, status).subscribe({
    next: (updatedApp) => {
      this.application = updatedApp;
      this.showSuccessMessage(`Application marked as ${status}`);
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.showErrorMessage('Failed to update application status.');
      this.isLoading = false;
    }
  });
}

  ngOnDestroy(): void {
    // Revoke object URLs on destroy
    Object.values(this.previewUrls).forEach((url) => {
      if (typeof url === 'string') URL.revokeObjectURL(url);
    });
    this.clearMessages();
  }
}
