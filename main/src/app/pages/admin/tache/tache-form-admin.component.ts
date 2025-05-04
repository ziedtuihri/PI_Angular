import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TacheService } from '../../../services/tache.service';
import { SprintService, Sprint } from '../../../services/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface StatusOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tache-form-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  
  ],
  templateUrl: './tache-form-admin.component.html',
  styleUrl: './tache-form-admin.component.scss',
  providers: [DatePipe],
})
export class TacheFormAdminComponent implements OnInit {
  tacheForm!: FormGroup;
  editMode = false;
  tacheId?: string | null;
  statusOptions: StatusOption[] = [
    { value: 'NOTSTARTED', viewValue: 'Non démarré' },
    { value: 'INPROGRESS', viewValue: 'En cours' },
    { value: 'DONE', viewValue: 'Terminée' },
    { value: 'BLOCKED', viewValue: 'Bloquée' },
  ];
  sprints: Sprint[] = [];
  tacheDetails: any;

  constructor(
    private fb: FormBuilder,
    private tacheService: TacheService,
    private sprintService: SprintService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.tacheId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.tacheId;

    this.tacheForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['', Validators.required],
      sprintId: [null],
    });

    this.sprintService.getAllSprints().subscribe(
      (sprints) => {
        this.sprints = sprints;
      },
      (error) => {
        console.error('Erreur lors de la récupération des sprints', error);
      }
    );

    if (this.editMode && this.tacheId) {
      this.tacheService.getTacheById(+this.tacheId).subscribe((tache: any) => {
        this.tacheDetails = tache;
        this.tacheForm.patchValue({
          nom: tache.nom,
          description: tache.description,
          dateDebut: tache.dateDebut ? new Date(tache.dateDebut) : '',
          dateFin: tache.dateFin ? new Date(tache.dateFin) : '',
          statut: tache.statut,
          sprintId: tache.sprint?.idSprint || null,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.tacheForm.invalid) {
      return;
    }

    const tacheData: any = { ...this.tacheForm.value };

    tacheData.dateDebut = this.datePipe.transform(tacheData.dateDebut, 'yyyy-MM-dd');
    tacheData.dateFin = this.datePipe.transform(tacheData.dateFin, 'yyyy-MM-dd');

    if (tacheData.sprintId === null) {
      delete tacheData.sprintId; // Supprimer si non sélectionné pour éviter d'envoyer null
    }

    console.log('Données envoyées :', tacheData);

    if (this.editMode && this.tacheId && this.tacheDetails?.idTache) {
      this.tacheService.updateTache(this.tacheDetails.idTache, tacheData).subscribe({
        next: () => this.router.navigate(['/taches']),
        error: (error) => console.error('Erreur lors de la mise à jour de la tâche', error),
      });
    } else {
      this.tacheService.createTache(tacheData).subscribe({
        next: () => this.router.navigate(['/taches']),
        error: (error) => console.error('Erreur lors de la création de la tâche', error),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/taches']);
  }
}