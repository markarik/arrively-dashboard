// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './features/layout/admin/admin.component';
import { GuestComponent } from './features/layout/guest/guest.component';
import { AuthGuard } from './core/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        canActivate: [AuthGuard],

        loadComponent: () => import('./features/pages/dashboard/dash-analytics.component'),
        data: {
          breadcrumb: {
            Label: 'DashBoard',
            info: 'home',
            routeInterceptor: () => {
              return '/analytics';
            }
          }
        }
      },

      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          breadcrumb: {
            info: 'home',
            routeInterceptor: () => {
              return '/analytics';
            }
          }
        },

        children: [
          {
            path: 'drivers',

            loadChildren: () => import('./features/pages/drivers/drivers-routing.module'),

            data: { breadcrumb: 'Drivers' }
          },

          {
            path: 'driver',

            data: {
              breadcrumb: {
                label: 'Driver',
                routeInterceptor: () => {
                  return '/admin/drivers';
                }
              }
            },

            children: [
              {
                path: ':driverId',
                loadChildren: () => import('./features/pages/drivers/driver-full-details/driver-full-details-routing.module'),
                data: {
                  breadcrumb: { alias: 'mentorName', disable: true }
                }
              }
            ]
          },

          {
            path: 'list-admins',

            loadChildren: () => import('./features/pages/admins/admins-routing.module'),

            data: { breadcrumb: 'Admins' }
          },

          {
            path: 'create-admin',

            loadChildren: () => import('./features/pages/admins/create/create_admin-routing.module'),

            data: { breadcrumb: 'Create Admin' }
          },

          



             {
            path: 'vehicle-types',

            loadChildren: () => import('./features/pages/vehicle_types/vehicle-types-routing.module'),

            data: { breadcrumb: 'Vehicle Types' }
          },

            {
            path: 'payment-modes',

            loadChildren: () => import('./features/pages/payment_methods/payment-options-routing.module'),

            data: { breadcrumb: 'Payment Options' }
          },
        ]
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'admin/signin',
        // loadComponent: () => import('./features/pages/auth/sign-in/sign-in.component')

        loadChildren: () => import('./features/pages/auth/sign-in/sign-in.routes')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
