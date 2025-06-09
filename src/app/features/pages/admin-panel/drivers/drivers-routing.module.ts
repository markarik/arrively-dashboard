import { Routes } from '@angular/router';
import { DriversComponent } from './drivers.component';
import { teamResolver } from './drivers.resolver';

export default [
  {
    path: '',
    component: DriversComponent,
    resolve: {
      driversList: teamResolver
    },

     
    
  }
] as Routes;
