import type { CuisineType } from '../../types/recipe';
import { CUISINE_COLORS, CUISINE_LABELS } from '../../types/recipe';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = '' }: BadgeProps) {
  const style = color ? { backgroundColor: `${color}20`, color } : {};
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${!color ? 'bg-slate-100 text-slate-600' : ''} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

export function CuisineBadge({ cuisine }: { cuisine: CuisineType }) {
  return (
    <Badge color={CUISINE_COLORS[cuisine]}>
      {CUISINE_LABELS[cuisine]}
    </Badge>
  );
}
