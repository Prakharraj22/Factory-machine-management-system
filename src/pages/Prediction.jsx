import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  BrainCircuit, AlertTriangle, Clock, Wrench,
  Download, SortAsc, SortDesc, Calendar,
} from 'lucide-react';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { getPredictions } from '../services/api';

const riskColors = {
  Critical: {
    text: 'text-danger-400',
    bg: 'bg-danger-500/10',
    border: 'border-danger-500/25',
    bar: 'from-danger-400 to-danger-600',
    badge: 'bg-danger-500',
    dot: 'bg-danger-500 animate-pulse',
  },
  High: {
    text: 'text-warning-400',
    bg: 'bg-warning-500/10',
    border: 'border-warning-500/25',
    bar: 'from-warning-400 to-danger-500',
    badge: 'bg-warning-500',
    dot: 'bg-warning-500',
  },
  Medium: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/25',
    bar: 'from-yellow-400 to-warning-500',
    badge: 'bg-yellow-500',
    dot: 'bg-yellow-500',
  },
  Low: {
    text: 'text-success-400',
    bg: 'bg-success-500/10',
    border: 'border-success-500/25',
    bar: 'from-success-400 to-success-600',
    badge: 'bg-success-500',
    dot: 'bg-success-500',
  },
};

function GaugeCard({ prediction }) {
  const rc = riskColors[prediction.riskLevel] || riskColors.Low;
  const pieData = [
    { name: 'Risk', value: prediction.failureProbability },
    { name: 'Safe', value: 100 - prediction.failureProbability },
  ];
  const gaugeColor = prediction.failureProbability >= 75 ? '#ef4444'
    : prediction.failureProbability >= 50 ? '#f59e0b' : '#22c55e';

  return (
    <div className={`rounded-2xl border ${rc.border} ${rc.bg} p-5 transition-all duration-300 group`}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${rc.dot}`} />
            <h3 className="font-bold text-dark-900 dark:text-white text-sm">{prediction.machine}</h3>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{prediction.name}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${rc.badge}`}>
          {prediction.riskLevel}
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center my-2">
        <div className="relative w-32 h-20 overflow-hidden">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                startAngle={180}
                endAngle={0}
                innerRadius="65%"
                outerRadius="100%"
                dataKey="value"
                stroke="none"
              >
                <Cell fill={gaugeColor} />
                <Cell fill="rgba(30,41,59,0.3)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <span className={`text-2xl font-black ${rc.text}`}>{prediction.failureProbability}%</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-dark-500 dark:text-dark-400">Failure Probability</span>
          <span className={`font-bold ${rc.text}`}>{prediction.failureProbability}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-dark-200 dark:bg-dark-700 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${rc.bar} transition-all duration-1000`}
            style={{ width: `${prediction.failureProbability}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3 pt-3 border-t border-dark-200/50 dark:border-dark-700/50">
        <div className="flex items-start gap-2">
          <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${rc.text}`} />
          <div>
            <p className="text-[10px] font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wider">Reason</p>
            <p className="text-xs text-dark-700 dark:text-dark-300 mt-0.5">{prediction.reason}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Wrench className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary-400" />
          <div>
            <p className="text-[10px] font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wider">Action</p>
            <p className="text-xs text-dark-700 dark:text-dark-300 mt-0.5">{prediction.recommendation}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-dark-400" />
            <p className="text-[10px] font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wider">Est. Failure</p>
          </div>
          <span className={`text-xs font-bold ${rc.text}`}>{prediction.nextFailure}</span>
        </div>
      </div>

      {/* Action button */}
      <button className="w-full mt-4 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold hover:bg-primary-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        Schedule Maintenance
      </button>
    </div>
  );
}

export default function Prediction() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('failureProbability');
  const [sortDir, setSortDir] = useState('desc');
  const [filterRisk, setFilterRisk] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPredictions();
        setPredictions(data);
      } catch (err) {
        console.error('Failed to load predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <SkeletonDashboard />;

  const riskSummary = [
    { name: 'Critical', value: predictions.filter((p) => p.riskLevel === 'Critical').length, color: '#ef4444' },
    { name: 'High', value: predictions.filter((p) => p.riskLevel === 'High').length, color: '#f59e0b' },
    { name: 'Medium', value: predictions.filter((p) => p.riskLevel === 'Medium').length, color: '#eab308' },
    { name: 'Low', value: predictions.filter((p) => p.riskLevel === 'Low').length, color: '#22c55e' },
  ];

  const sorted = [...predictions]
    .filter((p) => filterRisk === 'All' || p.riskLevel === filterRisk)
    .sort((a, b) => {
      const v = sortDir === 'desc' ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
      return v;
    });

  const toggleSort = () => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-900 dark:text-white">Predictive Maintenance</h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            ML-powered failure prediction and maintenance scheduling
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <BrainCircuit className="h-4 w-4 text-primary-400" />
            <span className="text-xs font-bold text-primary-400">ML Model v2.4</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success-400 animate-pulse" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800 dark:bg-dark-700 text-white text-xs font-bold hover:bg-dark-700 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Risk overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
          <h3 className="text-sm font-bold text-dark-800 dark:text-white mb-5">Risk Distribution Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {riskSummary.map((item) => (
              <button
                key={item.name}
                onClick={() => setFilterRisk(filterRisk === item.name ? 'All' : item.name)}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  filterRisk === item.name
                    ? 'border-current scale-105'
                    : 'border-dark-200 dark:border-dark-700 hover:border-current hover:scale-102'
                }`}
                style={{ borderColor: filterRisk === item.name ? item.color : undefined, color: item.color }}
              >
                <div className="h-14 w-14 rounded-full flex items-center justify-center text-2xl font-black text-white mb-2" style={{ backgroundColor: item.color }}>
                  {item.value}
                </div>
                <p className="text-xs font-bold" style={{ color: item.color }}>{item.name}</p>
                <p className="text-[10px] text-dark-400 mt-0.5">Risk Level</p>
              </button>
            ))}
          </div>
          {filterRisk !== 'All' && (
            <button onClick={() => setFilterRisk('All')} className="mt-4 text-xs text-primary-500 hover:text-primary-400 font-semibold">
              ← Show all risk levels
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
          <h3 className="text-sm font-bold text-dark-800 dark:text-white mb-4">Risk Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={riskSummary.filter((r) => r.value > 0)}
                innerRadius="55%"
                outerRadius="80%"
                dataKey="value"
                stroke="none"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {riskSummary.filter((r) => r.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30,41,59,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {riskSummary.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-dark-600 dark:text-dark-300">{item.name}</span>
                </div>
                <span className="font-bold text-dark-800 dark:text-white">{item.value} machines</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-dark-900 dark:text-white">Machine Predictions</h2>
          <p className="text-xs text-dark-500 dark:text-dark-400">{sorted.length} predictions shown</p>
        </div>
        <button
          onClick={toggleSort}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-xs font-semibold text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
        >
          {sortDir === 'desc' ? <SortDesc className="h-3.5 w-3.5" /> : <SortAsc className="h-3.5 w-3.5" />}
          {sortDir === 'desc' ? 'Highest Risk First' : 'Lowest Risk First'}
        </button>
      </div>

      {/* Prediction cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sorted.map((pred, i) => (
          <div key={pred.machine} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in">
            <GaugeCard prediction={pred} />
          </div>
        ))}
      </div>
    </div>
  );
}
