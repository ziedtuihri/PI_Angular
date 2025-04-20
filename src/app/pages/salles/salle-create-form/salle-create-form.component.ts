import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'salle-create-form',
  templateUrl: './salle-create-form.component.html',
  styleUrls: ['./salle-create-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],

})
export class SalleCreateFormComponent implements OnInit {
  salleForm!: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly reunionService: ReunionService) { }

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
    }
  }
}
