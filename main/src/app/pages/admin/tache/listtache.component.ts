import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../../services/tache.service'; // Ajustez le chemin si nécessaire

@Component({
  selector: 'app-listtache',
  templateUrl: './listtache.component.html',
  styleUrls: ['./listtache.component.scss']
})
export class ListtacheComponent implements OnInit {
  taches: any[] = []; // Utilisation de any[] car nous n'avons pas de modèle Tache
  loading = true;
  errorMessage = '';

  constructor(private tacheService: TacheService) { }

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.loading = true;
    this.tacheService.getAllTaches().subscribe({
      next: (data) => {
        this.taches = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des tâches.';
        console.error(error);
        this.loading = false;
      }
    });
  }
}