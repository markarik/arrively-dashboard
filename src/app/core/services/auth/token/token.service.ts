import { Injectable } from '@angular/core';
import { SessionStore } from 'src/app/core/helpers/session-store/session-store';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  myTokens: any;

  constructor(private sessionStore: SessionStore) {}

  get userToken(): any {
    this.myTokens = this.sessionStore.getValue().tokenResource;

    var token = this.myTokens.token;

    return token;
  }

  get refreshToken(): any {
    var myTokens = this.sessionStore.getValue().tokenResource;

    var token = myTokens.refreshToken;

    return token;
  }

  get getUserRole(): any {
    var userData = this.sessionStore.getValue().userResource;


    var role = userData.data.role;

    return role;
  }
}
