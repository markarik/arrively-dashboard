import { Routes } from '@angular/router';
import { getAdminsResolver } from './admins.resolver';
import { AdminsComponent } from './admins.component';

export default [
  {
    path: '',
    component: AdminsComponent,
    resolve: {
      adminsList: getAdminsResolver
    },

     
    
  }
] as Routes;
