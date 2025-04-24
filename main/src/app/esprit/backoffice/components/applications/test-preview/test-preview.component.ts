import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';

@Component({
  selector: 'app-test-preview',
  imports: [CommonModule],
  templateUrl: './test-preview.component.html',
  styleUrl: './test-preview.component.scss'
})
export class TestPreviewComponent {
  
  previewUrl: SafeResourceUrl | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private jobApplicationService: JobApplicationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const applicationId = 6; // Replace with actual ID (can be passed via route or @Input)
    const fileType = 'cv';   // or 'motivationLetter'

    this.jobApplicationService.downloadFile(applicationId, fileType).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loading = false;
      },
      error: err => {
        console.error('Download error:', err);
        this.error = 'Failed to load document';
        this.loading = false;
      }
    });
  }
}
