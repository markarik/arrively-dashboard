export enum UserRole {
  AdminEnum = 'Admin',
  SuperAdminEnum = 'SuperAdmin'
}

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
  roles?: UserRole[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'fas fa-house',
        roles: [UserRole.AdminEnum, UserRole.SuperAdminEnum]
      }
    ]
  },

  {
    id: 'people',
    title: 'Clients',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'drivers',
        title: 'Drivers',
        type: 'item',
        url: '/admin/drivers',
        icon: 'fas fa-user-tie',
        classes: 'nav-item',
        roles: [UserRole.AdminEnum, UserRole.SuperAdminEnum]
      }
    ]
  },

  {
    id: 'admins',
    title: 'Admins',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'listadmins',
        title: 'Admins',
        type: 'item',
        url: '/admin/list-admins',
        icon: 'fas fa-user',
        classes: 'nav-item',
        roles: [UserRole.SuperAdminEnum]
      },

      {
        id: 'acreatedmins',
        title: 'Create Admin',
        type: 'item',
        url: '/admin/create-admin',
        icon: 'fas fa-user-plus',
        classes: 'nav-item',
        roles: [UserRole.SuperAdminEnum]
      }
    ]
  },

  {
    id: 'ui-component',
    title: 'Basic Information',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'button',
        title: 'Vehicle Types',
        icon: 'fas fa-car',

        type: 'item',
        url: '/admin/vehicle-types'
      },

         {
        id: 'button',
        title: 'Payment Modes',
        icon: 'fas fa-cash-register',
        

        type: 'item',
        url: '/admin/payment-modes'
      },



      
      
    ]
  }
];

// export const NavigationItems: NavigationItem[] = [
//   {
//     id: 'navigation',
//     title: 'Navigation',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'dashboard',
//         title: 'Dashboard',
//         type: 'item',
//         url: '/analytics',
//         icon: 'feather icon-home'
//       }
//     ]
//   },
//   {
//     id: 'ui-component',
//     title: 'Ui Component',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'basic',
//         title: 'Component',
//         type: 'collapse',
//         icon: 'feather icon-box',
//         children: [
//           {
//             id: 'button',
//             title: 'Button',
//             type: 'item',
//             url: '/component/button'
//           },
//           {
//             id: 'badges',
//             title: 'Badges',
//             type: 'item',
//             url: '/component/badges'
//           },
//           {
//             id: 'breadcrumb-pagination',
//             title: 'Breadcrumb & Pagination',
//             type: 'item',
//             url: '/component/breadcrumb-paging'
//           },
//           {
//             id: 'collapse',
//             title: 'Collapse',
//             type: 'item',
//             url: '/component/collapse'
//           },
//           {
//             id: 'tabs-pills',
//             title: 'Tabs & Pills',
//             type: 'item',
//             url: '/component/tabs-pills'
//           },
//           {
//             id: 'typography',
//             title: 'Typography',
//             type: 'item',
//             url: '/component/typography'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 'Authentication',
//     title: 'Authentication',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'signup',
//         title: 'Sign up',
//         type: 'item',
//         url: '/auth/signup',
//         icon: 'feather icon-at-sign',
//         target: true,
//         breadcrumbs: false
//       },
//       {
//         id: 'signin',
//         title: 'Sign in',
//         type: 'item',
//         url: '/auth/signin',
//         icon: 'feather icon-log-in',
//         target: true,
//         breadcrumbs: false
//       }
//     ]
//   },
//   {
//     id: 'chart',
//     title: 'Chart',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'apexchart',
//         title: 'ApexChart',
//         type: 'item',
//         url: '/chart',
//         classes: 'nav-item',
//         icon: 'feather icon-pie-chart'
//       }
//     ]
//   },
//   {
//     id: 'forms & tables',
//     title: 'Forms & Tables',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'forms',
//         title: 'Basic Forms',
//         type: 'item',
//         url: '/forms',
//         classes: 'nav-item',
//         icon: 'feather icon-file-text'
//       },
//       {
//         id: 'tables',
//         title: 'tables',
//         type: 'item',
//         url: '/tables',
//         classes: 'nav-item',
//         icon: 'feather icon-server'
//       }
//     ]
//   },
//   {
//     id: 'other',
//     title: 'Other',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'sample-page',
//         title: 'Sample Page',
//         type: 'item',
//         url: '/sample-page',
//         classes: 'nav-item',
//         icon: 'feather icon-sidebar'
//       },
//       {
//         id: 'menu-level',
//         title: 'Menu Levels',
//         type: 'collapse',
//         icon: 'feather icon-menu',
//         children: [
//           {
//             id: 'menu-level-2.1',
//             title: 'Menu Level 2.1',
//             type: 'item',
//             url: 'javascript:',
//             external: true
//           },
//           {
//             id: 'menu-level-2.2',
//             title: 'Menu Level 2.2',
//             type: 'collapse',
//             children: [
//               {
//                 id: 'menu-level-2.2.1',
//                 title: 'Menu Level 2.2.1',
//                 type: 'item',
//                 url: 'javascript:',
//                 external: true
//               },
//               {
//                 id: 'menu-level-2.2.2',
//                 title: 'Menu Level 2.2.2',
//                 type: 'item',
//                 url: 'javascript:',
//                 external: true
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];
