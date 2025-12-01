import { ResolveFn } from '@angular/router';
import {  VehicleStyleService } from './vehicle_types.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { VehicleStyleModel } from './vehicle_types_data';

export const vehicleTypeResolver: ResolveFn<VehicleStyleModel[]> = (route, state) => {
  const _vehicleStyleService = inject(VehicleStyleService);





  return _vehicleStyleService
    .getVehicleTypes()

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
