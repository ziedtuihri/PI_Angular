import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist';

import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry'; // just import it — no assignment

import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Set the workerSrc to the correct path (pdfjs takes care of it internally with Vite)
GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.entry.js';

@Component({
  selector: 'app-pdf-viewer',
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {
  @Input() pdfUrl!: string;
  @ViewChild('pdfCanvas', { static: false }) pdfCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.pdfUrl) {
      const loadingTask = getDocument(this.pdfUrl);
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        // Get first page
        pdf.getPage(1).then(page => {
          const canvas = this.pdfCanvas.nativeElement;
          const context = canvas.getContext('2d')!;
          const viewport = page.getViewport({ scale: 1.5 });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };

          page.render(renderContext);
        });
      });
    }
  }
}
