import { Routes } from '@angular/router';
import { driverDetailsResolver } from './driver-full-details.resolver';
import { DriversFullDetailsComponent } from './driver-full-details.component';

export default [
    {
        path: 'details',
        component: DriversFullDetailsComponent,
                data: { breadcrumb: { skip: true } },

        resolve: {
            driverDetails: driverDetailsResolver,
        },
       
    },
] as Routes;
