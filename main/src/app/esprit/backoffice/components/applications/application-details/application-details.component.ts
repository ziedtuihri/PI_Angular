import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MessageDisplayComponent } from 'src/app/shared/components/message-display/message-display.component';
import { JobApplication } from 'src/app/shared/models/job-application';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { TestPreviewComponent } from '../test-preview/test-preview.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-application-details',
  imports: [CommonModule,MessageDisplayComponent,TestPreviewComponent,PdfViewerComponent],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.scss'
})
export class ApplicationDetailsComponent {
  applicationId!: number;
  application?: JobApplication;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  messageTimeout: any = null;
  //previewUrls: { [key: string]: SafeUrl } = {};
  previewUrls: { [key: string]: string } = {};
  showPreview: { [key: string]: boolean } = {
    cv: false,
    coverletter: false,
    certificates: false
  };

  activePreviewType: string | null = null; // Controls modal visibility



  constructor(
    private route: ActivatedRoute,
    private jobAppService: JobApplicationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadApplicationDetails();
  }

  loadApplicationDetails(): void {
    this.isLoading = true;
    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    
    // to be changed get directly by id
    this.jobAppService.getApplicationById(this.applicationId).subscribe({
      next: (app) => {
        this.application = app;
        
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorMessage('Failed to load application details');
        console.error('Error fetching applications:', err);
        this.isLoading = false;
      }
    });
  }


  downloadFile(fileType: string): void {
    this.jobAppService.downloadFile(this.applicationId, fileType)
      .subscribe({
        next: (blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          
          // Set a default filename based on file type
          let filename = 'document.pdf';
          switch(fileType) {
            case 'cv':
              filename = 'CV.pdf';
              break;
            case 'coverletter':
              filename = 'CoverLetter.pdf';
              break;
            case 'certificates':
              filename = 'Certificates.pdf';
              break;
          }
          
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href); // Clean up
        },
        error: (error) => {
          console.error('Error downloading file:', error);
          this.showErrorMessage('Could not download the file. Please try again later.');
        }
      });
  }

  previewFile(fileType: string): void {
    if (this.previewUrls[fileType]) {
      this.activePreviewType = fileType;
      return;
    }
  
    this.jobAppService.downloadFile(this.applicationId, fileType)
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.previewUrls[fileType] = url;
          this.activePreviewType = fileType;
        },
        error: (error) => {
          console.error('Error previewing file:', error);
          this.showErrorMessage('Could not preview the file. Please try again later.');
        }
      });
  }

  closePreview(fileType: string): void {
    this.activePreviewType = null;
  }

  getDocumentTitle(type: string): string {
    switch (type) {
      case 'cv': return 'Curriculum Vitae';
      case 'coverletter': return 'Cover Letter';
      case 'certificates': return 'Certificates';
      default: return 'Document';
    }
  }
  

  /* previewFile(fileType: string): void {
    if (this.previewUrls[fileType]) {
      // Toggle preview if URL already exists
      this.showPreview[fileType] = !this.showPreview[fileType];
      return;
    }
  
    this.jobAppService.downloadFile(this.applicationId, fileType)
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);  // No sanitizer here
          this.previewUrls[fileType] = url;       // Just store the raw string URL
          this.showPreview[fileType] = true;
        },
        error: (error) => {
          console.error('Error previewing file:', error);
          this.showErrorMessage('Could not preview the file. Please try again later.');
        }
      });
  } */
  
  
  /* previewFile(fileType: string): void {
    if (this.previewUrls[fileType]) {
      // Toggle preview if URL already exists
      this.showPreview[fileType] = !this.showPreview[fileType];
      return;
    }
    
    this.jobAppService.downloadFile(this.applicationId, fileType)
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.previewUrls[fileType] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.showPreview[fileType] = true;
        },
        error: (error) => {
          console.error('Error previewing file:', error);
          this.showErrorMessage('Could not preview the file. Please try again later.');
        }
      });
  } */


  updateApplicationStatus(status: string): void {
    /* if (!this.application) return;
    
    this.isLoading = true;
    this.jobAppService.updateApplicationStatus(this.applicationId, status).subscribe({
      next: () => {
        if (this.application) {
          this.application.status = status;
        }
        this.showSuccessMessage(`Application status updated to ${status}`);
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorMessage('Failed to update application status');
        console.error('Error updating status:', err);
        this.isLoading = false;
      }
    }); */
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-new';
    return `status-${status.toLowerCase()}`;
  }

  getScorePercentage(score: number): string {
    if (!score && score !== 0) return '0%';
    // Assuming the maximum score is 100
    const percentage = Math.min(100, Math.max(0, score));
    return `${percentage}%`;
  }

  // Messaging system methods
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
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = null;
    }
  }
  
  private setMessageTimeout(duration: number): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.clearMessages();
    }, duration);
  }

  ngOnDestroy(): void {
    // Clean up any object URLs to prevent memory leaks
    Object.values(this.previewUrls).forEach(url => {
      if (typeof url === 'string') {
        URL.revokeObjectURL(url);
      }
    });
    this.clearMessages();
  }
}
