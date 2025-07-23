import { Routes } from '@angular/router';
import { DriversComponent } from './drivers.component';
import { driversResolver } from './drivers.resolver';

export default [
  {
    path: '',
    component: DriversComponent,
    resolve: {
      driversList: driversResolver
    },

     
    
  }
] as Routes;
