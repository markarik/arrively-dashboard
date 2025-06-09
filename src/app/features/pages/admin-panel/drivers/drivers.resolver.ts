import { ResolveFn } from '@angular/router';
import {  TeamService } from './drivers.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DriverAcountsModel } from './drivers_data';

export const teamResolver: ResolveFn<DriverAcountsModel[]> = (route, state) => {
  const _teamService = inject(TeamService);





  return _teamService
    .getDrivers()

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
