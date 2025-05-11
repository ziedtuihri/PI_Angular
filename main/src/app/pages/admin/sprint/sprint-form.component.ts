import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SprintService, Sprint, Projet as SprintProjet } from '../../../services/sprint.service';
import { ProjetService, Projet } from '../../../services/projet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule (si vous utilisez des icônes)

interface StatusOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sprint-form',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule, 
    ReactiveFormsModule, 
  ],
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss'],
  providers: [DatePipe],
})
export class SprintFormComponent implements OnInit {
  sprintForm!: FormGroup;
  editMode = false;
  sprintId?: string | null;
  statusOptions: StatusOption[] = [
    { value: 'NOTSTARTED', viewValue: 'Non démarré' },
    { value: 'INPROGRESS', viewValue: 'En cours' },
    { value: 'CANCELLED', viewValue: 'Annulé' },
    { value: 'DONE', viewValue: 'Terminé' },
  ];
  projets: Projet[] = [];

  constructor(
    private fb: FormBuilder,
    private sprintService: SprintService,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.sprintId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.sprintId;

    this.sprintForm = this.fb.group({
      nom: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['', Validators.required],
      description: [''],
      projetId: [null, Validators.required],
    });

    this.projetService.getAll().subscribe(
      (projets) => {
        this.projets = projets;
      },
      (error) => {
        console.error('Erreur lors de la récupération des projets', error);
      }
    );

    if (this.editMode && this.sprintId) {
      this.sprintService.getSprintById(+this.sprintId).subscribe((sprint) => {
        this.sprintForm.patchValue({
          nom: sprint.nom,
          dateDebut: sprint.dateDebut ? new Date(sprint.dateDebut) : null,
          dateFin: sprint.dateFin ? new Date(sprint.dateFin) : null,
          statut: sprint.statut,
          description: sprint.description,
          projetId: sprint.projet?.idProjet,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.sprintForm.invalid) {
      return;
    }

    const sprintData = { ...this.sprintForm.value };
    sprintData.dateDebut = this.datePipe.transform(sprintData.dateDebut, 'yyyy-MM-dd');
    sprintData.dateFin = this.datePipe.transform(sprintData.dateFin, 'yyyy-MM-dd');

    if (this.editMode && this.sprintId) {
      this.sprintService.updateSprint(+this.sprintId, sprintData).subscribe({
        next: () => this.router.navigate(['/sprints']),
        error: (error) => console.error('Erreur lors de la mise à jour du sprint', error),
      });
    } else {
      this.sprintService.createSprint(sprintData).subscribe({
        next: () => this.router.navigate(['/sprints']),
        error: (error) => console.error('Erreur lors de la création du sprint', error),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/sprints']);
  }
}