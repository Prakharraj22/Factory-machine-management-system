import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const colorMap = {
  primary: {
    bg: 'from-primary-500/10 to-primary-600/5',
    iconBg: 'bg-primary-500/15',
    iconColor: 'text-primary-400',
    border: 'border-primary-500/20',
    glow: 'rgba(59,130,246,0.12)',
    text: 'text-primary-400',
  },
  success: {
    bg: 'from-success-500/10 to-success-600/5',
    iconBg: 'bg-success-500/15',
    iconColor: 'text-success-400',
    border: 'border-success-500/20',
    glow: 'rgba(34,197,94,0.12)',
    text: 'text-success-400',
  },
  warning: {
    bg: 'from-warning-500/10 to-warning-600/5',
    iconBg: 'bg-warning-500/15',
    iconColor: 'text-warning-400',
    border: 'border-warning-500/20',
    glow: 'rgba(245,158,11,0.12)',
    text: 'text-warning-400',
  },
  danger: {
    bg: 'from-danger-500/10 to-danger-600/5',
    iconBg: 'bg-danger-500/15',
    iconColor: 'text-danger-400',
    border: 'border-danger-500/20',
    glow: 'rgba(239,68,68,0.12)',
    text: 'text-danger-400',
  },
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-600/5',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
    glow: 'rgba(6,182,212,0.12)',
    text: 'text-cyan-400',
  },
  violet: {
    bg: 'from-violet-500/10 to-violet-600/5',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/20',
    glow: 'rgba(139,92,246,0.12)',
    text: 'text-violet-400',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  trendNeutral,
  color = 'primary',
  unit = '',
  badge,
  onClick,
}) {
  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700/80 p-5 overflow-hidden transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.12), 0 0 0 1px ${c.glow.replace('0.12', '0.25')}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Background gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-60 pointer-events-none`} />

      {/* Top border accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.bg} opacity-100`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">
              {title}
            </p>
            {badge && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide text-white ${
                badge === 'LIVE' ? 'bg-success-500 animate-pulse' :
                badge === 'NEW' ? 'bg-primary-500' : 'bg-dark-500'
              }`}>
                {badge}
              </span>
            )}
          </div>

          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1 tracking-tight">
            {value}{unit}
          </p>

          {subtitle && (
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {trendNeutral ? (
                <Minus className="h-3.5 w-3.5 text-dark-400" />
              ) : trendUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-success-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-danger-400" />
              )}
              <span className={`text-xs font-semibold ${
                trendNeutral ? 'text-dark-400' :
                trendUp ? 'text-success-500' : 'text-danger-500'
              }`}>
                {trend}
              </span>
              <span className="text-xs text-dark-400">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`shrink-0 ml-3 p-3 rounded-xl ${c.iconBg} border ${c.border} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-5 w-5 ${c.iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
