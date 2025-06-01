import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'salle-create-form',
  templateUrl: './salle-create-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,MatDividerModule]
})
export class SalleCreateFormComponent implements OnInit {

  salleForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly reunionService: ReunionService
  ) { }

  ngOnInit(): void {
    this.salleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      capacite: [1, [Validators.required, Validators.min(1)]],
      disponible: [true]
    });
  }

  onSubmit(): void {
    if (this.salleForm.valid) {
      const nouvelleSalle = this.salleForm.value;
      this.reunionService.createSalle(nouvelleSalle).subscribe(() => {
        alert('Salle ajoutée avec succès !');
        this.salleForm.reset({ disponible: true, capacite: 1 });
      });
    } else {
      this.salleForm.markAllAsTouched();
    }
  }
}
