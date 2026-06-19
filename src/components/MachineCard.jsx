import { Activity, Thermometer, Gauge, Zap, Heart, Clock, ArrowRight } from 'lucide-react';

const statusConfig = {
  Healthy: {
    bg: 'bg-success-500/8 dark:bg-success-500/10',
    border: 'border-success-500/25',
    badge: 'bg-success-500',
    badgeText: 'text-success-400',
    dot: 'status-pulse-green',
    progress: 'from-success-400 to-success-500',
    glow: '0 0 20px rgba(34,197,94,0.08)',
  },
  Warning: {
    bg: 'bg-warning-500/8 dark:bg-warning-500/10',
    border: 'border-warning-500/25',
    badge: 'bg-warning-500',
    badgeText: 'text-warning-400',
    dot: 'status-pulse-amber',
    progress: 'from-warning-400 to-warning-500',
    glow: '0 0 20px rgba(245,158,11,0.08)',
  },
  Critical: {
    bg: 'bg-danger-500/8 dark:bg-danger-500/10',
    border: 'border-danger-500/25',
    badge: 'bg-danger-500',
    badgeText: 'text-danger-400',
    dot: 'status-pulse-red',
    progress: 'from-danger-400 to-danger-600',
    glow: '0 0 20px rgba(239,68,68,0.12)',
  },
};

const vibrationConfig = {
  CRITICAL: { color: 'text-danger-400', label: 'CRITICAL' },
  HIGH: { color: 'text-warning-400', label: 'HIGH' },
  MEDIUM: { color: 'text-yellow-400', label: 'MEDIUM' },
  LOW: { color: 'text-success-400', label: 'LOW' },
};

function HealthArc({ score }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="72" height="72" className="transform -rotate-90">
      <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
    </svg>
  );
}

export default function MachineCard({ machine }) {
  const config = statusConfig[machine.status] || statusConfig.Healthy;
  const vibConfig = vibrationConfig[machine.vibration] || vibrationConfig.LOW;

  return (
    <div
      className={`relative rounded-2xl border ${config.border} bg-white dark:bg-dark-800 overflow-hidden group transition-all duration-300`}
      style={{ boxShadow: config.glow }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `${config.glow}, 0 24px 48px rgba(0,0,0,0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = config.glow;
      }}
    >
      {/* Top color stripe */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.progress}`} />

      {/* Background tint */}
      <div className={`absolute inset-0 ${config.bg} pointer-events-none`} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Activity className="h-4 w-4 text-primary-400" />
              </div>
              <div className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${config.dot}`} />
            </div>
            <div>
              <h3 className="font-bold text-dark-900 dark:text-white text-sm leading-tight">{machine.id}</h3>
              <p className="text-[11px] text-dark-500 dark:text-dark-400 leading-tight mt-0.5">{machine.name}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${config.badge} shadow-sm`}>
            {machine.status}
          </span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-dark-50 dark:bg-dark-900/60 border border-dark-200 dark:border-dark-700/50">
            <Thermometer className="h-3.5 w-3.5 text-danger-400 mb-1" />
            <span className="text-xs font-bold text-dark-800 dark:text-white">{machine.temperature}°C</span>
            <span className="text-[9px] text-dark-400 mt-0.5">TEMP</span>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-dark-50 dark:bg-dark-900/60 border border-dark-200 dark:border-dark-700/50">
            <Gauge className="h-3.5 w-3.5 text-primary-400 mb-1" />
            <span className="text-xs font-bold text-dark-800 dark:text-white">{machine.pressure}</span>
            <span className="text-[9px] text-dark-400 mt-0.5">PSI</span>
          </div>
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-dark-50 dark:bg-dark-900/60 border border-dark-200 dark:border-dark-700/50">
            <Zap className={`h-3.5 w-3.5 mb-1 ${vibConfig.color}`} />
            <span className={`text-[10px] font-bold ${vibConfig.color}`}>{vibConfig.label}</span>
            <span className="text-[9px] text-dark-400 mt-0.5">VIB</span>
          </div>
        </div>

        {/* Health Score + Arc */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-200 dark:border-dark-700/50">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Heart className="h-3 w-3 text-primary-400" />
              <span className="text-[11px] font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wider">Health</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-dark-200 dark:bg-dark-700 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${config.progress} transition-all duration-1200`}
                style={{ width: `${machine.healthScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-dark-400" />
                <span className="text-[10px] text-dark-400">Uptime {machine.uptime}%</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0 relative">
            <HealthArc score={machine.healthScore} />
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <span className={`text-sm font-bold ${
                machine.healthScore >= 80 ? 'text-success-400' :
                machine.healthScore >= 60 ? 'text-warning-400' : 'text-danger-400'
              }`}>
                {machine.healthScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Hover action */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2.5 bg-gradient-to-t from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-400">
            View Details <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
