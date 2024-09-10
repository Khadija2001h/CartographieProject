import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Briefcase as BriefcaseIcon } from '@phosphor-icons/react/dist/ssr/Briefcase';
import { MapPin as MapPinIcon } from '@phosphor-icons/react/dist/ssr/MapPin';
import { Lifebuoy as LifebuoyIcon } from '@phosphor-icons/react/dist/ssr/Lifebuoy'; // Ajoutez cette ligne pour le support
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { XSquare as XSquareIcon } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'user': UserIcon,
  'x-square': XSquareIcon,
  'briefcase': BriefcaseIcon,
  'map-pin': MapPinIcon,
  'lifebuoy': LifebuoyIcon, // Ajoutez l'icône pour Suports
} as Record<string, Icon>;