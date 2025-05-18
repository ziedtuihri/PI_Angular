import { Routes } from '@angular/router';
import { ParticipantCreateFromComponent } from './participant-create-from/participant-create-from.component';
import { ParticipantsComponent } from './participants.component';


// pages

export const ParticipantsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'participant-form',
                component: ParticipantCreateFromComponent,
            },

          

            {
                path: 'participants-list',
                component: ParticipantsComponent,
            },

        ],
    },
];
