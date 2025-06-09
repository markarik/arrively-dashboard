import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Query } from '@datorama/akita';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SessionState, SessionStore } from './session-store';

function parseJwt (token: any) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

@Injectable({
  providedIn: 'root'
})
export class SessionQuery extends Query<SessionState> implements OnDestroy {

  isLoggedIn$!: Observable<any>;
  tokenResource!: Observable<any>;
  userResource!: Observable<any>;
  name!: Observable<any>;
  rememberMe$!: Observable<any>;
  permissionResource!: Observable<any>;
  socialsResource!: Observable<any>;

  timeoutCountdown = new BehaviorSubject(null);
  pauseIdleCheckService = new BehaviorSubject(false);

  isBrowser = false;
  private localSubscription: Subscription = new Subscription();


  constructor(protected override store: SessionStore, 
    @Inject(PLATFORM_ID) platformId: object) {
    super(store);

    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.isLoggedIn$ = this.select(state => state ? !!state.userResource : false);
      this.tokenResource = this.select(state => state ? state.tokenResource : null);
      this.userResource = this.select(state => state ? state.userResource : null);
      // this.name = this.select(state => state ? state.name : null);
      this.rememberMe$ = this.select(state => state ? state.remember : false);
      this.permissionResource = this.select(state => state.permissionResource);
      this.socialsResource = this.select(state => state.socialsResource);
    }
  }

  ngOnDestroy(): void {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
      
    }
  }
  public IsTokenViable(): Promise<boolean> {
    return new Promise((r, rj) => {
      const now = new Date().valueOf() / 1000;
      this.localSubscription=this.tokenResource.pipe().pipe().subscribe(token => {
        const tokenDetails = this.tokenResource ? parseJwt(token.accessToken) : this.tokenResource;

        if (tokenDetails ) {
          const diff = tokenDetails.exp-now;

          if (diff <= 6000) {
            r(false);
          } else {
            r(true);
          }
        }
        rj(false)
      });
    });
  }
}
