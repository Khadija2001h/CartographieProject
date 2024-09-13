import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Entreprises', title: 'Entreprises', href: paths.dashboard.customers, icon: 'briefcase' }, // Remplace par 'briefcase'
  { key: 'Geolocalisation', title: 'Geolocalisation', href: paths.dashboard.integrations, icon: 'map-pin' }, // Remplace par 'map-pin'
  { key: 'Supports', title: 'Supports', href: paths.dashboard.settings, icon: 'lifebuoy' }, // Remplace par 'lifebuoy' pour Suports
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];