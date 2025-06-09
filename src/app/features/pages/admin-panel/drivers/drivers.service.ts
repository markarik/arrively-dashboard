import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { DriverAcountsModel } from './drivers_data';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/auth/token/token.service';



const BASE_API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})



export class TeamService implements OnDestroy {
  private plansSubject = new ReplaySubject<DriverAcountsModel[]>(1);
  plans$: Observable<DriverAcountsModel[]> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();
  private _tokenService = inject(TokenService);

  constructor(
      public router: Router,
      private http: HttpClient,
  ) {}

  getDrivers(): Observable<DriverAcountsModel[]> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
       
      });

      return this.http
          .get<DriverAcountsModel[]>(`${BASE_API_URL}/get-drivers`, {
              headers,
          })
          .pipe(
              tap((res: DriverAcountsModel[]) => {
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



