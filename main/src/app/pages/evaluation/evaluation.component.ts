import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService, Evaluation } from '../../services/evaluation.service';
import { FormEvaluationComponent } from '../form-evaluation/form-evaluation.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule, FormEvaluationComponent],
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  evaluations: Evaluation[] = [];
  selectedEvaluation: Evaluation | null = null;

  searchTitre: string = '';
  searchDate: string = '';
  searchProjet: string = '';

  constructor(
    private evaluationService: EvaluationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    this.evaluationService.getAll().subscribe({
      next: (data) => {
        this.evaluations = data;
        console.log('Évaluations chargées :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des évaluations :', err);
      }
    });
  }

  modifierEvaluation(evaluation: Evaluation): void {
    const dialogRef = this.dialog.open(FormEvaluationComponent, {
      width: '500px',
      data: { evaluationToEdit: evaluation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadEvaluations();
      }
    });
  }

  supprimerEvaluation(id: number): void {
    console.log('Suppression en cours pour l\'ID :', id);
    this.evaluationService.delete(id).subscribe({
      next: () => {
        console.log('Évaluation supprimée.');
        this.evaluations = this.evaluations.filter(evaluation => evaluation.idEvaluation !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
      }
    });
  }

  confirmerEtSupprimer(id: number): void {
    if (window.confirm('Voulez-vous vraiment supprimer cette évaluation ?')) {
      this.supprimerEvaluation(id);
    }
  }



  filteredEvaluations(): Evaluation[] {
    return this.evaluations.filter(evaluation =>
      (this.searchTitre === '' || evaluation.titre?.toLowerCase().includes(this.searchTitre.toLowerCase())) &&
      (this.searchDate === '' || evaluation.dateEvaluation?.startsWith(this.searchDate)) &&
      (this.searchProjet === '' || evaluation.projet?.nom?.toLowerCase().includes(this.searchProjet.toLowerCase()))
    );
  }
}
