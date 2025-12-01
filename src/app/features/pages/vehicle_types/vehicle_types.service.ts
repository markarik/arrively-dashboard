import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { VehicleStyleModel } from './vehicle_types_data';
import { environment } from 'src/environments/environment';



const BASE_API_URL = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})



export class VehicleStyleService implements OnDestroy {
  private plansSubject = new ReplaySubject<VehicleStyleModel[]>(1);
  plans$: Observable<VehicleStyleModel[]> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();

  constructor(
      public router: Router,
      private http: HttpClient,
  ) {}

  getVehicleTypes(): Observable<VehicleStyleModel[]> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
       
      });

      return this.http
          .get<VehicleStyleModel[]>(`${BASE_API_URL}/vehicle-styles`, {
              headers,
          })
          .pipe(
              tap((res: VehicleStyleModel[]) => {
                  this.plansSubject.next(res);
              }),
              catchError((error: any) => {
                  // Return the error along with the resolved data
                  this.plansSubject.error(error);
                  return throwError(error);
              })
          );
  }




 

  ngOnDestroy(): void {
      if (this.localSubscription) {
          this.localSubscription.unsubscribe();
      }
  }
}



