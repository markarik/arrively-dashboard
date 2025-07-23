import { ResolveFn } from '@angular/router';
import {  PaymentOptionsService } from './payment-options.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminPaymentOptionsModel } from './payment-options-data';

export const paymentOptionsResolver: ResolveFn<AdminPaymentOptionsModel[]> = (route, state) => {
  const _paymentOptionsService = inject(PaymentOptionsService);





  return _paymentOptionsService
    .getPaymentOptions()

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
