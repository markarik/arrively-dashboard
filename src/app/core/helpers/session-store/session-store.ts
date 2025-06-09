import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { AppCryptoAESService } from "./app-crypto-aes.service";

export interface SessionState {
  tokenResource: any;
  userResource: any;
  remember: boolean;
  phone: any;
  permissionResource: any;
  socialsResource: any;
}

export function createInitialState(encryptionService: AppCryptoAESService, isBrowser: boolean): SessionState {

  if (isBrowser) {
    return {
      tokenResource: null,
      userResource: null,
      remember: false,
      phone: null,
      permissionResource: null,
      socialsResource: null,
      ...localStorage.getItem('fcsubscriptionSession') ? JSON.parse(encryptionService.get(localStorage.getItem('fcsubscriptionSession')) as unknown as string) :
      JSON.parse(encryptionService.get(sessionStorage.getItem('fcsubscriptionSession')) as unknown as string)
    };
  }

  return {
    tokenResource: null,
      userResource: null,
      remember: false,
      phone: null,
      permissionResource: null,
      socialsResource: null,
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'fcsubscriptionSession' })
export class SessionStore extends Store<SessionState> {
  isBrowser = false;
  constructor(
    private encryptionService: AppCryptoAESService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    super(createInitialState(encryptionService, isPlatformBrowser(platformId)));
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // getSession(){
  //   return createInitialState(this.encryptionService, isPlatformBrowser(PLATFORM_ID))
  // }


  override akitaPreUpdate(prevState: SessionState, nextState: SessionState) {
    if (nextState.remember) {
      localStorage.setItem('fcsubscriptionSession',
        this.encryptionService.set(JSON.stringify(nextState)) as unknown as string);
    } else {
      sessionStorage.setItem('fcsubscriptionSession',
        this.encryptionService.set(JSON.stringify(nextState)) as unknown as string);
    }
    return nextState;
  }

  logout(): Promise<any> {
    return new Promise((resolve) => {
      sessionStorage.removeItem('fcsubscriptionSession');
      
      localStorage.removeItem('fcsubscriptionSession');
      this.update(createInitialState(this.encryptionService, this.isBrowser));
      setTimeout(() => {
        sessionStorage.removeItem('fcsubscriptionSession');
        localStorage.removeItem('fcsubscriptionSession');
      }, 50);
      resolve(true);
    });
  }

}
