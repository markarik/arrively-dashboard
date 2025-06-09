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
           

            loadChildren: () => import('./features/pages/admin-panel/drivers/drivers-routing.module'),

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
                loadChildren: () => import('./features/pages/admin-panel/drivers/driver-full-details/driver-full-details-routing.module'),
                data: {
                  breadcrumb: { alias: 'mentorName', disable: true }
                }
              }
            ]
          }
        ]
      },

    
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
