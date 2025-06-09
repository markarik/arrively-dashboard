import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { SessionStore } from '../../helpers/session-store/session-store';
import {
  DeviceDetectorService,
  DeviceInfoModel,
} from '../../helpers/device-detector/device-detector.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  isBrowser = false;

  routeURL!: string;
  myTokens: any;


  deviceInfo: DeviceInfoModel = new DeviceInfoModel();
  private subscription: Subscription = new Subscription();


  constructor(
    private device: DeviceDetectorService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private sessionStore: SessionStore,
  ) {
   
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      
      this.subscription.add( this.device.deviceSubj.subscribe((info) => (this.deviceInfo = info)));

      this.isBrowser = isPlatformBrowser(this.platformId);
      this.myTokens = this.sessionStore.getValue().tokenResource;




      if (

        this.myTokens == null &&
        this.routeURL != '/admin/signin'
      ) {
        this.routeURL = '/admin/signin';

        if (state.url != null) {
        } else {
        }

        this.router.navigate(['/admin/signin'], {
          queryParams: {
            return: state.url,
          },
        });
        return resolve(false);
      } else {
        this.routeURL = this.router.url;

          return resolve(true);
          // Access token is still valid, no need to refresh
         
            
            
        
      }
      
    });

    
  }
  ngOnDestroy() {
    this.subscription.unsubscribe(); // Unsubscribe when component is destroyed
  }
}
