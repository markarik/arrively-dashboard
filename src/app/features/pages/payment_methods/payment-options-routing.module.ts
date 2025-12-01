

import { Routes } from '@angular/router';
import { PaymentOptionsComponent } from './payment-options.component';
import { paymentOptionsResolver } from './payment-options.resolver';

export default [
  {
    path: '',
    component: PaymentOptionsComponent,
    resolve: {
      paymentOptions: paymentOptionsResolver
    },

     
    
  }
] as Routes;
