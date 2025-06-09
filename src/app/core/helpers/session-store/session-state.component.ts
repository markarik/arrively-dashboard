import { Component, } from '@angular/core';
import {  Router } from '@angular/router';

import { SessionQuery } from './session-query.service';

@Component({
  selector: 'app-session-state',
  template: `
  `,
  styles: [
  ],
  standalone: false,
})
export class SessionStateComponent     {

  AppConfig: any;

  constructor(
    private sQuery: SessionQuery,
    private router: Router,
  ) {
  }

  

  

}
