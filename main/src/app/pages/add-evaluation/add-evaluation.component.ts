import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { ProjetService } from '../../services/projet.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-add-evaluation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatSelect,
    MatOption,
    NgForOf
  ],
  templateUrl: './add-evaluation.component.html',
  styleUrls: ['./add-evaluation.component.scss']
})
export class AddEvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;
  projetId: number;
  sprintId: number;
  projet: any;
  sprints: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private projetService: ProjetService,
    private snackBar: MatSnackBar // Injection de MatSnackBar

  ) {}

  ngOnInit(): void {
    this.projetId = +this.route.snapshot.paramMap.get('idProjet')!; // Correction ici
    this.initForm();

    this.projetService.getById(this.projetId).subscribe({
      next: (data) => {
        this.projet = data;
        this.findSprintsByIdProjet(this.projetId);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du projet :', err);
        alert('Impossible de charger le projet.');
      }
    });
  }


  initForm(): void {
    this.evaluationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      dateEvaluation: ['', Validators.required],
      coef: [null, [Validators.required, Validators.min(0)]],
      sprintId: [null, Validators.required]

    });
  }

  findSprintsByIdProjet(projetId: number) :void {
    this.evaluationService.getSprintsByProjetId(projetId).
    subscribe({next: (sprints) =>{
      this.sprints = sprints;
      }});

}



  onSubmit(): void {
    if (this.evaluationForm.invalid || !this.projet || !this.sprintId) return;

    const evaluationData = this.evaluationForm.value;
    const dateEvaluation = new Date(evaluationData.dateEvaluation);
    const dateFinProjet = new Date(this.projet.dateFinPrevue);

    if (dateEvaluation <= dateFinProjet) {
      alert('La date de l\'évaluation doit être après la date de fin prévue du projet.');
      return;
    }

    const requestData = {
      titre: evaluationData.titre,
      description: evaluationData.description,
      dateEvaluation: dateEvaluation.toISOString().split('T')[0],
      coef: evaluationData.coef
    };

    this.evaluationService.addEvaluationToProjet(this.projetId, this.sprintId,requestData).subscribe({
      next: (res) => {
        console.log('Évaluation ajoutée avec succès', res);
        // Afficher un message de succès
        this.snackBar.open('Évaluation ajoutée avec succès', 'Fermer', {
          duration: 3000, // Durée de la notification en millisecondes
          horizontalPosition: 'right', // Position horizontale
          verticalPosition: 'top' // Position verticale
        });
        //ici
        this.router.navigate(['/projets']);
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de l’évaluation :', err);
        alert(err.error || 'Erreur lors de l\'ajout de l\'évaluation.');
      }
    });
  }


  /* onValueChange($event: Event) {
    console.log($event)
   // this.sprintId = $event.sprintId;

  }*/

  onValueChange(event: any): void {
    this.sprintId = event.value; // event.value contient l'ID sélectionné
    //console.log('Sprint sélectionné ID =', this.sprintId);
  }

}




