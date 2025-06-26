import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Projet, ProjetService } from '../../../services/projet.service';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';


import { jwtDecode } from 'jwt-decode';

  // Define an interface for the decoded token
  interface DecodedToken {
    fullName: string;
    sub: string;
    iat: number;
    exp: number;
    authorities: string[];
  }


@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss'],
  providers: [DatePipe], 
})


export class ProjetComponent implements OnInit {
  projets: Projet[] = [];
  displayedColumns: string[] = ['nom', 'statut', 'fichier', 'dateDebut', 'dateFinPrevue', 'actions'];

  constructor(private projetService: ProjetService, private router: Router, private datePipe: DatePipe) {}



  ngOnInit(): void {
    this.loadProjets();

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Decode the token
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log(decodedToken);

      // Print email, role, and full name
      console.log('Email:', decodedToken.sub);
      console.log('Full Name:', decodedToken.fullName);
      console.log('Role:', decodedToken.authorities[0]);

    } else {
      console.error('Token not found in localStorage');
    }

  }

  loadProjets() {
    this.projetService.getAll().subscribe({
      next: (data) => (this.projets = data),
      error: (err) => console.error('Erreur lors du chargement des projets', err),
    });
  }

  onAddProjet() {
    this.router.navigate(['/projet/form']);
  }

  onEditProjet(id: number | undefined) {
    this.router.navigate(['/projet/form', id]);
  }

  onDeleteProjet(id: number | undefined) {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.delete(id).subscribe(() => this.loadProjets());
    }
  }

  downloadFile(idProjet: number): void {
    this.projetService.downloadFile(idProjet).subscribe(response => {
      this.downloadBlob(response.body!, this.getFileNameFromContentDisposition(response.headers.get('Content-Disposition')));
    });
  }

  private downloadBlob(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  private getFileNameFromContentDisposition(contentDisposition: string | null): string {
    if (!contentDisposition) {
      return 'fichier';
    }
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches.length > 1) {
      return matches[1].replace(/['"]/g, '');
    }
    return 'fichier';
  }
  onViewDetail(id: number | undefined) {
    if (id) {
      this.router.navigate(['/projet/detail', id]);
    }
  }


  onAddEvaluation(idProjet: number): void {
    // Exemple avec navigation vers un composant d'ajout d'évaluation avec l'ID du projet
    this.router.navigate(['/add-evaluation', idProjet]);
  }
}