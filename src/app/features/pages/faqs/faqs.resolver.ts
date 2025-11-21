import { ResolveFn } from '@angular/router';
import {  FaqsService } from './faqs.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { FAQModel } from './faq_data';

export const faqResolver: ResolveFn<FAQModel> = (route, state) => {
  const _faqsService = inject(FaqsService);





  return _faqsService
    .getFaqs()

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
