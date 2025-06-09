import { ResolveFn } from '@angular/router';
import {  AdminsService } from './admins.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DriverAcountsModel } from './admins_data';

export const getAdminsResolver: ResolveFn<DriverAcountsModel[]> = (route, state) => {
  const _adminService = inject(AdminsService);





  return _adminService
    .getAdmins()

    .pipe(
      catchError((error) => {
          //TODO uncomment this when needed

        // this.route.navigate(['error-available'], {replaceUrl: true}).then(() => {
        //   window.location.reload();
        // });

        // Return the error along with the resolved data
        return throwError(error);
      })
    );
  }
