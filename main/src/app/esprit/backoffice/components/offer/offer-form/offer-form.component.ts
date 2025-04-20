import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Offer } from 'src/app/shared/models/offer';

@Component({
  selector: 'app-offer-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offer-form.component.html',
  styleUrl: './offer-form.component.scss'
})
export class OfferFormComponent {
  @Input() isEditing = false;
  @Input() offerToEdit: Offer | null = null;
  @Output() formSubmit = new EventEmitter<{offer: Offer, isEditing: boolean}>();
  @Output() formCancel = new EventEmitter<void>();
  
  offerForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.offerForm = this.createOfferForm();
  }
  
  ngOnInit(): void {
    if (this.isEditing && this.offerToEdit) {
      this.offerForm.patchValue({
        title: this.offerToEdit.title,
        description: this.offerToEdit.description,
        company: this.offerToEdit.company,
        location: this.offerToEdit.location,
        type: this.offerToEdit.type,
        startDate: this.offerToEdit.startDate,
        endDate: this.offerToEdit.endDate,
        companyId: this.offerToEdit.companyId
      });
    }
  }
  
  createOfferForm(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]],
      startDate: [null],
      endDate: [null],
      companyId: [null]
    });
  }
  
  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.offerForm.value;
    
    // Convert date strings to Date objects if needed
    if (formValue.startDate && typeof formValue.startDate === 'string') {
      formValue.startDate = new Date(formValue.startDate);
    }
    
    if (formValue.endDate && typeof formValue.endDate === 'string') {
      formValue.endDate = new Date(formValue.endDate);
    }
    
    // Include the original ID if editing
    if (this.isEditing && this.offerToEdit) {
      formValue.id = this.offerToEdit.id;
    }
    
    this.formSubmit.emit({
      offer: formValue,
      isEditing: this.isEditing
    });
  }
  
  onCancel(): void {
    this.formCancel.emit();
  }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.offerForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
}
