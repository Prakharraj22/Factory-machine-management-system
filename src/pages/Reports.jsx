import { useState, useEffect } from 'react';
import {
  FileText, Download, Calendar, Filter,
  BarChart2, Wrench, AlertTriangle, TrendingUp,
  CheckCircle, Clock, Database, FileDown,
} from 'lucide-react';
import { getMachines, getAnalytics, getPredictions } from '../services/api';
import { SkeletonDashboard } from '../components/SkeletonLoader';

const REPORT_TYPES = [
  {
    id: 'maintenance',
    label: 'Maintenance Report',
    icon: Wrench,
    color: 'from-primary-500 to-cyan-500',
    description: 'Scheduled maintenance, completed tasks, upcoming work orders',
    badge: 'bg-primary-500',
  },
  {
    id: 'downtime',
    label: 'Downtime Analysis',
    icon: AlertTriangle,
    color: 'from-warning-500 to-danger-500',
    description: 'Machine downtime events, root cause analysis, cost impact',
    badge: 'bg-warning-500',
  },
  {
    id: 'asset',
    label: 'Asset Health Report',
    icon: BarChart2,
    color: 'from-success-500 to-cyan-600',
    description: 'Fleet health scores, utilization, efficiency metrics',
    badge: 'bg-success-500',
  },
  {
    id: 'executive',
    label: 'Executive Summary',
    icon: TrendingUp,
    color: 'from-violet-500 to-primary-600',
    description: 'KPIs, OEE, MTBF, cost savings for executive stakeholders',
    badge: 'bg-violet-500',
  },
];

const DATE_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Last 6 Months', 'Year to Date', 'Custom'];

function ReportPreview({ type, machines, analytics, predictions }) {
  if (!machines || !analytics) return (
    <div className="flex items-center justify-center h-64 text-dark-400">
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Select a report type and date range to preview</p>
      </div>
    </div>
  );

  const healthy = machines.filter(m => m.status === 'Healthy').length;
  const warning = machines.filter(m => m.status === 'Warning').length;
  const critical = machines.filter(m => m.status === 'Critical').length;
  const avgHealth = Math.round(machines.reduce((a, m) => a + m.healthScore, 0) / machines.length);

  if (type === 'maintenance') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-center">
            <p className="text-2xl font-black text-success-400">{healthy}</p>
            <p className="text-xs text-success-500 font-semibold">Healthy</p>
          </div>
          <div className="p-3 rounded-xl bg-warning-500/10 border border-warning-500/20 text-center">
            <p className="text-2xl font-black text-warning-400">{warning}</p>
            <p className="text-xs text-warning-500 font-semibold">Scheduled</p>
          </div>
          <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-center">
            <p className="text-2xl font-black text-danger-400">{critical}</p>
            <p className="text-xs text-danger-500 font-semibold">Urgent</p>
          </div>
        </div>
        <div className="space-y-2">
          {machines.slice(0, 5).map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-700">
              <div>
                <p className="text-xs font-bold text-dark-800 dark:text-white">{m.id} — {m.name}</p>
                <p className="text-[10px] text-dark-400">Last maintenance: {m.lastMaintenance}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${
                m.status === 'Healthy' ? 'bg-success-500' : m.status === 'Warning' ? 'bg-warning-500' : 'bg-danger-500'
              }`}>{m.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'asset') {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <p className="text-5xl font-black text-primary-400">{avgHealth}%</p>
          <p className="text-sm text-dark-500 mt-1">Average Fleet Health Score</p>
        </div>
        <div className="space-y-2">
          {machines.slice(0, 6).map(m => (
            <div key={m.id} className="flex items-center gap-3 p-2">
              <p className="text-xs font-semibold text-dark-700 dark:text-dark-200 w-28 shrink-0">{m.id}</p>
              <div className="flex-1 h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.healthScore >= 80 ? 'bg-success-500' : m.healthScore >= 60 ? 'bg-warning-500' : 'bg-danger-500'}`}
                  style={{ width: `${m.healthScore}%` }}
                />
              </div>
              <span className="text-xs font-bold text-dark-800 dark:text-white w-12 text-right">{m.healthScore}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'executive') {
    const oee = ((healthy / machines.length) * (analytics.metrics.machineUtilization / 100) * 0.982 * 100).toFixed(1);
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'OEE', value: `${oee}%`, color: 'text-primary-400' },
          { label: 'Availability', value: `${((healthy / machines.length) * 100).toFixed(1)}%`, color: 'text-success-400' },
          { label: 'Utilization', value: `${analytics.metrics.machineUtilization}%`, color: 'text-cyan-400' },
          { label: 'Avg Health', value: `${avgHealth}%`, color: 'text-violet-400' },
          { label: 'Failures/mo', value: analytics.metrics.failureFrequency, color: 'text-warning-400' },
          { label: 'Critical Now', value: critical, color: 'text-danger-400' },
        ].map(kpi => (
          <div key={kpi.label} className="p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50 border border-dark-200 dark:border-dark-700">
            <p className="text-[10px] text-dark-400 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
    );
  }

  // downtime
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-dark-800 dark:text-white">High-Risk Machines (Predicted Downtime)</p>
      {(predictions || []).filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').map(p => (
        <div key={p.machine} className="flex items-start gap-3 p-3 rounded-xl bg-danger-500/5 border border-danger-500/20">
          <AlertTriangle className="h-4 w-4 text-danger-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-dark-800 dark:text-white">{p.machine} — {p.name}</p>
            <p className="text-[11px] text-dark-500 mt-0.5">{p.reason}</p>
            <p className="text-[11px] font-semibold text-danger-400 mt-1">Est. failure: {p.nextFailure}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [selectedType, setSelectedType] = useState('maintenance');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [machines, setMachines] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, a, p] = await Promise.all([getMachines(), getAnalytics(), getPredictions()]);
        setMachines(m);
        setAnalytics(a);
        setPredictions(p);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(false);
    setGenerated(true);
  };

  if (loading) return <SkeletonDashboard />;

  const selectedReportType = REPORT_TYPES.find(r => r.id === selectedType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-dark-900 dark:text-white">Reports</h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
          Generate, preview, and export professional industrial reports
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: Config Panel ─────────────────────────── */}
        <div className="space-y-5">
          {/* Report Type */}
          <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
            <h3 className="text-sm font-bold text-dark-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary-400" />
              Report Type
            </h3>
            <div className="space-y-2">
              {REPORT_TYPES.map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => { setSelectedType(rt.id); setGenerated(false); }}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedType === rt.id
                      ? 'border-primary-500/40 bg-primary-500/8'
                      : 'border-dark-200 dark:border-dark-700 hover:border-primary-500/20 hover:bg-dark-50 dark:hover:bg-dark-700/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${rt.color} shrink-0`}>
                    <rt.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-800 dark:text-white">{rt.label}</p>
                    <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-0.5">{rt.description}</p>
                  </div>
                  {selectedType === rt.id && (
                    <CheckCircle className="h-4 w-4 text-primary-400 ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
            <h3 className="text-sm font-bold text-dark-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-400" />
              Date Range
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {DATE_RANGES.map((dr) => (
                <button
                  key={dr}
                  onClick={() => setDateRange(dr)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    dateRange === dr
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-dark-50 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-500'
                  }`}
                >
                  {dr}
                </button>
              ))}
            </div>
          </div>

          {/* Generate + Export */}
          <div className="space-y-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-500 to-cyan-600 hover:from-primary-600 hover:to-cyan-700 disabled:opacity-60 transition-all shadow-lg shadow-primary-500/25"
            >
              {generating ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : generated ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Regenerate Report
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </button>

            {generated && (
              <div className="grid grid-cols-3 gap-2 animate-fade-in">
                {[
                  { label: 'PDF', icon: FileDown, color: 'text-danger-400' },
                  { label: 'Excel', icon: FileDown, color: 'text-success-400' },
                  { label: 'CSV', icon: FileDown, color: 'text-primary-400' },
                ].map(({ label, icon: Icon, color }) => (
                  <button
                    key={label}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-xs font-bold ${color} hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Preview Panel ───────────────────────── */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 overflow-hidden h-full">
            {/* Preview header */}
            <div className={`px-6 py-4 border-b border-dark-200 dark:border-dark-700 bg-gradient-to-r ${selectedReportType?.color} bg-opacity-10`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">{selectedReportType?.label}</h3>
                  <p className="text-[11px] text-white/70 mt-0.5">{dateRange} • Generated {new Date().toLocaleDateString()}</p>
                </div>
                {generated && (
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase">
                    Ready
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              {!generated ? (
                <div className="flex flex-col items-center justify-center h-64 text-dark-400">
                  <FileText className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-sm font-semibold">Configure and generate your report</p>
                  <p className="text-xs mt-1 text-dark-500">Select a type and date range, then click Generate</p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <ReportPreview
                    type={selectedType}
                    machines={machines}
                    analytics={analytics}
                    predictions={predictions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
