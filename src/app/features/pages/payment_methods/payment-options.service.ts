import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminPaymentOptionsModel } from './payment-options-data';

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
      Accept: 'application/json'
    });

    return this._httpClient
      .get<AdminPaymentOptionsModel[]>(`${BASE_API_URL}/get-payment-modes`, {
        headers
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

  addPaymentOption(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   Accept: 'application/json'
    });

    return this._httpClient
      .post(`${environment.apiUrl}/add-payment-method`, formData, {
        headers
      })
      .pipe(
        tap((response: any) => {
          // After successful addition, refresh the payment options
          this.refreshPaymentOptions();
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  // Method to refresh payment options data
  refreshPaymentOptions(): void {
    this.getPaymentOptions().subscribe({
      next: (data) => {
        // Data is already updated via tap operator in getPaymentOptions
      },
      error: (error) => {
        console.error('Error refreshing payment options:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }
}
