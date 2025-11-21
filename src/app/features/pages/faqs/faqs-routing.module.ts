

import { Routes } from '@angular/router';
import { FaqsComponent } from './faqs.component';
import { FaqsCreateComponent } from './create/faqs-create.component';
import { FaqsEditComponent } from './edit/faqs-edit.component';
import { faqResolver } from './faqs.resolver';

export default [
  {
    path: '',
    component: FaqsComponent,
    resolve: {
      faqs: faqResolver
    },
  },
  {
    path: 'create',
    component: FaqsCreateComponent,
    data: {
      breadcrumb: 'Create FAQ'
    }
  },
  {
    path: 'edit/:id',
    component: FaqsEditComponent,
    data: {
      breadcrumb: 'Edit FAQ'
    }
  }
] as Routes;
