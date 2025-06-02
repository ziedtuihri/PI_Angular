// src/app/components/projet/projet.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Projet, ProjetService } from '../../../services/projet.service'; // Adjust path if necessary
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

// Import the new AuthService you just created
import { AuthService } from '../../../services/auth.service'; // Adjust path if necessary

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
  displayedColumns: string[] = [
    'nom',
    'projectType',
    'statut',
    'fichier',
    'dateDebut',
    'dateFinPrevue',
    'actions',
  ];

  constructor(
    private projetService: ProjetService,
    private router: Router,
    private datePipe: DatePipe,
    // Inject the new AuthService here
    public authService: AuthService
  ) {}



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

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe({
      next: (data) => (this.projets = data),
      error: (err) => console.error('Erreur lors du chargement des projets', err),
    });
  }

  onAddProjet(): void {
    this.router.navigate(['/projet/form']);
  }

  onEditProjet(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/projet/form', id]);
    }
  }

  onDeleteProjet(id: number | undefined): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.delete(id).subscribe({
        next: () => this.loadProjets(),
        error: (err) => console.error('Erreur lors de la suppression du projet', err),
      });
    }
  }

  downloadFile(idProjet: number | undefined): void {
    if (idProjet === undefined) {
      console.error('Project ID is undefined for file download.');
      return;
    }
    this.projetService.downloadFile(idProjet).subscribe({
      next: (blobData) => {
        const fileName = `projet_${idProjet}_fichier.pdf`;
        this.downloadBlob(blobData, fileName);
      },
      error: (err) => console.error('Erreur lors du téléchargement du fichier', err),
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

  onViewDetail(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/projet/detail', id]);
    }
  }


  onAddEvaluation(idProjet: number): void {
    // Exemple avec navigation vers un composant d'ajout d'évaluation avec l'ID du projet
    this.router.navigate(['/add-evaluation', idProjet]);
  }
}