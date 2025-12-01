

import { Routes } from '@angular/router';
import { VehicleTypesComponent } from './vehicle_types.component';
import { vehicleTypeResolver } from './vehicle_types.resolver';

export default [
  {
    path: '',
    component: VehicleTypesComponent,
    resolve: {
      vehicleTypes: vehicleTypeResolver
    },

     
    
  }
] as Routes;
