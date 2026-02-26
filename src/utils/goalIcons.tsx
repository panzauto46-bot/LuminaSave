import {
  Car,
  Gem,
  Gamepad2,
  GraduationCap,
  House,
  Laptop,
  Mountain,
  Shield,
  Smartphone,
  Target,
  Plane,
  type LucideIcon,
} from 'lucide-react';

export interface GoalIconOption {
  id: string;
  label: string;
  Icon: LucideIcon;
  darkClass: string;
  lightClass: string;
}

export const GOAL_ICON_OPTIONS: GoalIconOption[] = [
  { id: 'target', label: 'Target', Icon: Target, darkClass: 'text-gold-300', lightClass: 'text-gold-600' },
  { id: 'travel', label: 'Travel', Icon: Plane, darkClass: 'text-trust-300', lightClass: 'text-trust-600' },
  { id: 'laptop', label: 'Laptop', Icon: Laptop, darkClass: 'text-neon-cyan', lightClass: 'text-trust-600' },
  { id: 'car', label: 'Car', Icon: Car, darkClass: 'text-orange-300', lightClass: 'text-orange-600' },
  { id: 'home', label: 'Home', Icon: House, darkClass: 'text-mint-300', lightClass: 'text-mint-600' },
  { id: 'education', label: 'Education', Icon: GraduationCap, darkClass: 'text-violet-300', lightClass: 'text-violet-600' },
  { id: 'safety', label: 'Safety', Icon: Shield, darkClass: 'text-emerald-300', lightClass: 'text-emerald-600' },
  { id: 'luxury', label: 'Luxury', Icon: Gem, darkClass: 'text-cyan-300', lightClass: 'text-cyan-600' },
  { id: 'gaming', label: 'Gaming', Icon: Gamepad2, darkClass: 'text-indigo-300', lightClass: 'text-indigo-600' },
  { id: 'phone', label: 'Phone', Icon: Smartphone, darkClass: 'text-pink-300', lightClass: 'text-pink-600' },
  { id: 'adventure', label: 'Adventure', Icon: Mountain, darkClass: 'text-amber-300', lightClass: 'text-amber-600' },
];

const LEGACY_ICON_MAP: Record<string, string> = {
  '🎯': 'target',
  '🗾': 'travel',
  '💻': 'laptop',
  '🚗': 'car',
  '🏠': 'home',
  '🎓': 'education',
  '🛡️': 'safety',
  '💍': 'luxury',
  '🎮': 'gaming',
  '📱': 'phone',
  '🏖️': 'adventure',
  '✈️': 'travel',
};

export function normalizeGoalIcon(icon: string) {
  return LEGACY_ICON_MAP[icon] ?? icon;
}

export function getGoalIconOption(icon: string) {
  const normalized = normalizeGoalIcon(icon);
  return GOAL_ICON_OPTIONS.find((option) => option.id === normalized) ?? null;
}

export function getGoalIconLabel(icon: string) {
  const option = getGoalIconOption(icon);
  return option?.label ?? 'Goal';
}
