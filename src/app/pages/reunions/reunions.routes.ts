import { Routes } from '@angular/router';
import { ReunionCreateFormComponent } from './reunion-create-form/reunion-create-form.component';
import { ReunionEventComponent } from './reunion-event/reunion-event.component';
import { ReunionListComponent } from './reunion-list/reunion-list.component';


// pages

export const ReunionsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'reunion-form',
                component: ReunionCreateFormComponent,
            },

            {
                path: 'event',
                component: ReunionEventComponent,
            },

            {
                path: 'reunion-list',
                component: ReunionListComponent,
            },

        ],
    },
];
