import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },

  {
    navCap: 'Gestion des Réunions',
    divider: true,
  },
  {
    displayName: 'Planification de réunion',
    iconName: 'solar:calendar-add-line-duotone',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Calendrier des réunions',
    iconName: 'solar:calendar-line-duotone',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Liste des réunions',
    iconName: 'fa-list', route: '/ui-components/lists',
  }
  ,

  {
    displayName: 'Réunions Passées (Historique)',
    iconName: 'solar:history-line-duotone',
    route: '/ui-components/menu',
  },

  {
    displayName: 'Notifications & Rappels',
    iconName: 'solar:bell-line-duotone',
    route: '/ui-components/forms',
  },
];
