// src/pdfjs-custom.d.ts
declare module 'pdfjs-dist/build/pdf' {
    export const GlobalWorkerOptions: {
      workerSrc: string;
    };
  }

  declare module 'pdfjs-dist/build/pdf.worker.entry'; 