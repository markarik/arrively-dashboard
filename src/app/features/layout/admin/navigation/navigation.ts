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
        icon: 'feather icon-home',
        roles: [UserRole.AdminEnum, UserRole.SuperAdminEnum]
      }
    ]
  },

  {
    id: 'people',
    title: 'Users',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'drivers',
        title: 'Drivers',
        type: 'item',
        url: '/admin/drivers',
        icon: 'feather icon-user',
        classes: 'nav-item',
        roles: [UserRole.AdminEnum, UserRole.SuperAdminEnum]
      },

      {
        id: 'admins',
        title: 'Admins',
        type: 'item',
        url: '/admin/admins',
        icon: 'feather icon-users',
        classes: 'nav-item',
        roles: [UserRole.SuperAdminEnum]
      }
    ]
  }
];
