import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, catchError, tap, throwError } from 'rxjs';
import { DriverFullDetailsModel } from './driver_details';
import { TokenService } from 'src/app/core/services/auth/token/token.service';
import { environment } from 'src/environments/environment';
import { Notify } from 'notiflix';
const BASE_API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root',
})
export class DriverFullDetailsService {
    private plansSubject = new ReplaySubject<DriverFullDetailsModel>(1);
    plans$: Observable<DriverFullDetailsModel> =
        this.plansSubject.asObservable();
    private _tokenService = inject(TokenService);

    constructor(public router: Router, private http: HttpClient) {}

    getDriverDetails(driverId: any): Observable<DriverFullDetailsModel> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',

        });

        return this.http
            .get<DriverFullDetailsModel>(
                `${BASE_API_URL}/get-driver-details/${driverId}`,
                {
                    headers,
                }
            )
            .pipe(
                tap((res: DriverFullDetailsModel) => {
                    this.plansSubject.next(res);
                }),
                catchError((error: any) => {
                    // Return the error along with the resolved data
                    this.plansSubject.error(error);
                    return throwError(error);
                })
            );
    }




      verifyVehicle(data: any,vehicleId: any) {
       
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
    
        return new Promise((r: any, rj: any) => {
          this.http
            .post(`${environment.apiUrl}/vehicle/${vehicleId}/verify`, data, {
              headers
            })
            .toPromise()
            .then((res: any) => {
                Notify.success(res.message);
    
               
              
              r(res);
            })
            .catch((e) => {
              Notify.failure(e.error.message || 'An error occurred. Please try again.');
    
              rj(e);
            });
        });
      }


  
}


