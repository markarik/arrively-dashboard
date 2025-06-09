import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { DriverAcountsModel } from './admins_data';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/core/services/auth/token/token.service';

const BASE_API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminsService implements OnDestroy {
  private plansSubject = new ReplaySubject<DriverAcountsModel[]>(1);
  plans$: Observable<DriverAcountsModel[]> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();
  private _tokenService = inject(TokenService);

  constructor(
    public router: Router,
    private _httpClient: HttpClient
  ) {}

  getAdmins(): Observable<DriverAcountsModel[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    return this._httpClient
      .get<DriverAcountsModel[]>(`${BASE_API_URL}/get-drivers`, {
        headers
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

  uploadFile(data: FormData) {
    const req = new HttpRequest('POST', `${environment.apiUrl}/upload/profile-image`, data, { reportProgress: true });
    return this._httpClient.request(req);
  }

  ngOnDestroy(): void {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }

  createAdmin(data:any){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          
        });


            return new Promise((r: any, rj: any) => {
              this._httpClient
                .post(`${environment.apiUrl}/create-admin`, data, {
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

        // return this._httpClient
        //     .post<any>(`${environment.apiUrl}/admin/create-admin`, data, { headers })
        //     .pipe(
        //         tap((res: any) => {
        //             this.plansSubject.next(res);
        //         }),
        //         catchError((error: any) => {
        //             this.plansSubject.error(error);
        //             return throwError(error);
        //         })
        //     );
    }
}
