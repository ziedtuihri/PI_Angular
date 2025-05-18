import { Routes } from '@angular/router';
import { SalleCreateFormComponent } from './salle-create-form/salle-create-form.component';
import { SallesListComponent } from './salles-list/salles-list.component';


// pages

export const SallesRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'salle-form',
                component: SalleCreateFormComponent,
            },

            {
                path: 'salles-list',
                component: SallesListComponent,
            },

        ],
    },
];
