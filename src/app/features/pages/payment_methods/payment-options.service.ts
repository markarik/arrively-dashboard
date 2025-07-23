import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { AdminPaymentOptionsModel } from './payment-options-data';
import { environment } from 'src/environments/environment';



const BASE_API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})



export class PaymentOptionsService implements OnDestroy {
  private plansSubject = new ReplaySubject<AdminPaymentOptionsModel[]>(1);
  plans$: Observable<AdminPaymentOptionsModel[]> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();

  constructor(
      public router: Router,
    private _httpClient: HttpClient
  ) {}

  getPaymentOptions(): Observable<AdminPaymentOptionsModel[]> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
       
      });

      return this._httpClient
          .get<AdminPaymentOptionsModel[]>(`${BASE_API_URL}/get-payment-modes`, {
              headers,
          })
          .pipe(
              tap((res: AdminPaymentOptionsModel[]) => {
                  this.plansSubject.next(res);
              }),
              catchError((error: any) => {
                  // Return the error along with the resolved data
                  this.plansSubject.error(error);
                  return throwError(error);
              })
          );
  }


  addPaymentOption(formData: FormData) {
    const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json'
    });

    return new Promise((r: any, rj: any) => {
      this._httpClient
        .post(`${environment.apiUrl}/add-payment-method`, formData, {
          headers
        })
        .toPromise()
        .then((res: any) => {
          r(res);
        })
        .catch((e) => {
          rj(e);
        });
    });
  }




 

  ngOnDestroy(): void {
      if (this.localSubscription) {
          this.localSubscription.unsubscribe();
      }
  }
}



