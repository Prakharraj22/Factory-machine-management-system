import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Download, Maximize2 } from 'lucide-react';
import { useState } from 'react';

const CHART_GRADIENTS = {
  temperature: { start: '#ef4444', end: '#f87171', id: 'tempGrad' },
  vibration:   { start: '#8b5cf6', end: '#a78bfa', id: 'vibGrad'  },
  pressure:    { start: '#3b82f6', end: '#60a5fa', id: 'presGrad' },
  failures:    { start: '#f59e0b', end: '#fbbf24', id: 'failGrad' },
  storage:     { start: '#06b6d4', end: '#67e8f9', id: 'storGrad' },
  savings:     { start: '#22c55e', end: '#4ade80', id: 'saveGrad' },
  efficiency:  { start: '#3b82f6', end: '#22c55e', id: 'effGrad'  },
  uptime:      { start: '#22c55e', end: '#86efac', id: 'uptGrad'  },
};

function CustomTooltip({ active, payload, label, dark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2.5 rounded-xl shadow-2xl border text-xs ${
      dark
        ? 'bg-dark-800/95 border-dark-600 text-white'
        : 'bg-white/95 border-dark-200 text-dark-800'
    }`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <p className="font-semibold text-dark-400 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-bold ml-auto pl-2">
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function GradientDefs({ colors }) {
  return (
    <defs>
      {colors.map((color, i) => {
        const grad = Object.values(CHART_GRADIENTS)[i] || { start: color, end: color + '88', id: `grad${i}` };
        return (
          <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={grad.start} stopOpacity={0.3} />
            <stop offset="95%" stopColor={grad.end} stopOpacity={0.02} />
          </linearGradient>
        );
      })}
    </defs>
  );
}

export default function LiveChart({
  title,
  data = [],
  type = 'line',
  dataKeys = [],
  colors = ['#3b82f6'],
  height = 280,
  thresholds = [],
  showLegend = true,
  subtitle,
}) {
  const { dark } = useTheme();
  const [fullscreen, setFullscreen] = useState(false);

  const xKey = dataKeys[0];
  const yKeys = dataKeys.slice(1);

  const axisStyle = {
    tick: { fill: dark ? '#64748b' : '#94a3b8', fontSize: 11, fontFamily: 'Outfit, Inter, sans-serif' },
    axisLine: false,
    tickLine: false,
  };

  const gridColor = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const handleExport = () => {
    const csvRows = [yKeys.join(',')];
    data.forEach((row) => {
      csvRows.push(yKeys.map((k) => row[k] ?? '').join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title?.replace(/\s/g, '_') || 'chart'}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartContent = (
    <ResponsiveContainer width="100%" height={fullscreen ? window.innerHeight - 200 : height}>
      {type === 'area' ? (
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <GradientDefs colors={colors} />
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          {showLegend && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', color: dark ? '#64748b' : '#94a3b8' }} />}
          {thresholds.map((t, i) => (
            <ReferenceLine key={i} y={t.value} stroke={t.color || '#ef4444'} strokeDasharray="4 4" label={{ value: t.label, fill: t.color || '#ef4444', fontSize: 10 }} />
          ))}
          {yKeys.map((key, i) => {
            const grad = Object.values(CHART_GRADIENTS)[i];
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i] || '#3b82f6'}
                strokeWidth={2}
                fill={grad ? `url(#${grad.id})` : colors[i] + '20'}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: colors[i] || '#3b82f6' }}
              />
            );
          })}
        </AreaChart>
      ) : type === 'bar' ? (
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          {showLegend && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', color: dark ? '#64748b' : '#94a3b8' }} />}
          {yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i] || '#3b82f6'} radius={[4, 4, 0, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} {...axisStyle} />
          <YAxis {...axisStyle} />
          <Tooltip content={<CustomTooltip dark={dark} />} />
          {showLegend && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', color: dark ? '#64748b' : '#94a3b8' }} />}
          {thresholds.map((t, i) => (
            <ReferenceLine key={i} y={t.value} stroke={t.color || '#ef4444'} strokeDasharray="4 4" label={{ value: t.label, fill: t.color || '#ef4444', fontSize: 10 }} />
          ))}
          {yKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[i] || '#3b82f6'}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: colors[i] || '#3b82f6' }}
            />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <>
      <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700/80 p-5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-dark-800 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-dark-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              title="Export CSV"
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 hover:text-dark-700 dark:hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFullscreen(true)}
              title="Expand"
              className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400 hover:text-dark-700 dark:hover:text-white"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {chartContent}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in-fast"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="w-full max-w-5xl rounded-2xl bg-dark-900 border border-dark-700 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button
                onClick={() => setFullscreen(false)}
                className="px-3 py-1.5 rounded-lg bg-dark-700 text-dark-300 text-xs hover:bg-dark-600 transition-colors"
              >
                Close
              </button>
            </div>
            {chartContent}
          </div>
        </div>
      )}
    </>
  );
}
