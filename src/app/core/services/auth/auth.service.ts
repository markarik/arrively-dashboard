import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, ReplaySubject, Subscription, tap, throwError } from 'rxjs';

import { Notify } from 'notiflix';
import { environment } from 'src/environments/environment';
import { SessionQuery } from '../../helpers/session-store/session-query.service';
import { SessionStore } from '../../helpers/session-store/session-store';
import { TokenService } from './token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  userData: any;
  userToken: any;

  private plansSubject = new ReplaySubject<any>(1);
  plans$: Observable<any> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();
  private _httpClient = inject(HttpClient);
  private sessionQ = inject(SessionQuery);

  myTokens: any;

  constructor(
    public router: Router,
    public ngZone: NgZone,
    private sessionStore: SessionStore
  ) {}

  ngOnDestroy(): void {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get accessToken(): string {
    this.myTokens = this.sessionStore.getValue().tokenResource;

    return this.myTokens == null ? '' : this.myTokens.refreshToken;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */

  signIn(email: any, password: any) {
    var data = {
      email: email,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return new Promise((r: any, rj: any) => {
      this._httpClient
        .post(`${environment.apiUrl}/admin-login`, data, {
          headers
        })
        .toPromise()
        .then((res: any) => {
          if (res != null && res.status == 'success') {

            this.sessionStore.update(() => ({
              tokenResource: {
                token: res.access_token,
                refreshToken: res.refresh_token
              }
            }));
          }
          r(res);
        })
        .catch((e) => {
          Notify.failure(e.error.message || 'An error occurred during sign in. Please try again.');

          rj(e);
        });
    });
  }

  getProfileDetails() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return new Promise((r: any, rj: any) => {
      this._httpClient
        .get(`${environment.apiUrl}/admin-profile`, {
          headers
        })
        .toPromise()
        .then((res: any) => {
          this.sessionStore.update((currentState) => {

            return {
              ...currentState,
              userResource: {
                data: res
              }
            };
          });

          r(res);
        })
        .catch((e) => {
                    console.log("Error during sign in:", e);

          Notify.failure(e.error.message || 'An error occurred during sign in. Please try again.');

          rj(e);
        });
    });
  }

  /**
   * Refresh token
   *
   * @param refreshToken
   */
  refreshToken(refreshToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._httpClient.post(`${environment.baseApiUrl}/refresh`, { refresh: refreshToken }, { headers }).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.sessionStore.update((currentState) => {
       
            return {
              ...currentState,
              tokenResource: {
                token: response.token,
                refreshToken: currentState.tokenResource.refreshToken
              }
            };
          });
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.sessionStore.logout();
    this.router.navigate(['/admin/signin']);
  }
}
