import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core'; // Important pour mat-datepicker

// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';

// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';

// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component'

import { LoginService } from './services/login.service'; // Adjust the path as necessary


import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    // Material Form Controls
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule, // <- Important pour mat-datepicker
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,

    // Material Navigation
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,

    // Material Layout
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,

    // Material Buttons & Indicators
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,

    // Material Popups & Modals
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,

    MatTooltipModule,

    // Material Data tables
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  exports: [
   // Material Form Controls
MatAutocompleteModule,
MatCheckboxModule,
MatDatepickerModule,
MatNativeDateModule, // <- pour l'export aussi
MatFormFieldModule,
MatInputModule,
MatRadioModule,
MatSelectModule,
MatSliderModule,
MatSlideToggleModule,

// Material Navigation
MatMenuModule,
MatSidenavModule,
MatToolbarModule,

// Material Layout
MatCardModule,
MatDividerModule,
MatExpansionModule,
MatGridListModule,
MatListModule,
MatStepperModule,
MatTabsModule,
MatTreeModule,

// Material Buttons & Indicators
MatButtonModule,
MatButtonToggleModule,
MatBadgeModule,
MatChipsModule,
MatIconModule,
MatProgressSpinnerModule,
MatProgressBarModule,
MatRippleModule,

// Material Popups & Modals
MatBottomSheetModule,
MatDialogModule,
MatSnackBarModule,
MatTooltipModule,

// Material Data tables
MatPaginatorModule,
MatSortModule,
MatTableModule,

// Reactive Forms
ReactiveFormsModule

  ],
  providers: [LoginService],
})
export class MaterialModule {
  // This module exports all Angular Material modules for easy import in other modules.
}
