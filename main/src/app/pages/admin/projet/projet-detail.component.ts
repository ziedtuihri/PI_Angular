import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { ProjetService, Projet } from '../../../services/projet.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; // Cleaned up FormsModule import

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './projet-detail.component.html',
  styleUrls: ['./projet-detail.component.scss']
})
export class ProjetDetailComponent implements OnInit {
  projetId: number | null = null;
  projet: Projet | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // The '+' converts the string parameter to a number
      this.projetId = +params['id'];
      if (this.projetId) {
        this.loadProjetDetails(this.projetId);
      } else {
        // Handle case where ID is not provided in the route (e.g., direct navigation without ID)
        this.errorMessage = "ID du projet non fourni.";
        console.warn('Projet ID is null in route parameters.');
      }
    });
  }

  loadProjetDetails(id: number): void {
    this.projetService.getById(id).subscribe({
      next: (projet: Projet) => {
        this.projet = projet;
      },
      error: (error: any) => {
        this.errorMessage = 'Erreur lors du chargement des détails du projet. Le projet n\'existe peut-être pas ou un problème de réseau est survenu.';
        console.error('Failed to load project details:', error);
      }
    });
  }

  goBack(): void {
    // Navigate back to the list of projects
    this.router.navigate(['/projet']);
  }
}