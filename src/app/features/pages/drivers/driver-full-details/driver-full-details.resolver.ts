import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { DriverFullDetailsService } from './driver-full-details.service';
import { DriverFullDetailsModel } from './driver_details';

export const driverDetailsResolver: ResolveFn<DriverFullDetailsModel> = (route, state) => {
    const _driverDetailsService = inject(DriverFullDetailsService);

    var driverId = route.params['driverId'];

    return _driverDetailsService
        .getDriverDetails(driverId)

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
};
