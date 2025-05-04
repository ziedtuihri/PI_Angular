import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjetService, Projet } from '../../../services/projet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-projet-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
  ],
})
export class ProjetFormComponent implements OnInit {
  projetForm!: FormGroup;
  editMode = false;
  projetId?: number;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projetId = this.route.snapshot.params['id'];
    this.editMode = !!this.projetId;

    this.projetForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
      dateDebut: ['', Validators.required],
      dateFinPrevue: ['', Validators.required],
      dateFinReelle: [''],
      statut: ['', Validators.required],
      file: [null],
      listeEtudiantsInput: ['', Validators.maxLength(500)], 
    });

    if (this.editMode) {
      this.projetService.getById(this.projetId!).subscribe((projet) => {
        this.projetForm.patchValue(projet);
        this.projetForm.patchValue({
          listeEtudiantsInput: projet.listeEtudiants ? projet.listeEtudiants.join(', ') : '',
        });
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.projetForm.patchValue({ file: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.projetForm.invalid) return;

    const formValue = this.projetForm.value;
    let listeEtudiants: string[] = [];

    if (formValue.listeEtudiantsInput) {
      listeEtudiants = formValue.listeEtudiantsInput
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '');
    }

    formValue.listeEtudiants = listeEtudiants;
    delete formValue.listeEtudiantsInput;

    if (this.editMode) {
      this.projetService.update(this.projetId!, formValue).subscribe(() => {
        if (this.selectedFile) {
          this.projetService.uploadFile(this.projetId!, this.selectedFile).subscribe(() => {
            this.router.navigate(['/projet']);
          });
        } else {
          this.router.navigate(['/projet']);
        }
      });
    } else {
      this.projetService.create(formValue).subscribe((projetCre) => {
        if (this.selectedFile && projetCre && projetCre.idProjet) {
          this.projetService.uploadFile(projetCre.idProjet, this.selectedFile).subscribe(() => {
            this.router.navigate(['/projet']);
          });
        } else {
          this.router.navigate(['/projet']);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/projet']);
  }
}