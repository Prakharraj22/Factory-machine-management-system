import { useState, useEffect, useCallback } from 'react';
import {
  Server, Wifi, AlertTriangle, AlertCircle, Search, Filter,
  Activity, TrendingUp, Clock, Wrench, DollarSign,
  BarChart2, RefreshCw, Shield, Zap,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import MachineCard from '../components/MachineCard';
import LiveChart from '../components/LiveChart';
import AlertBox from '../components/AlertBox';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { getMachines, getMachineTimeSeries, getAnalytics } from '../services/api';

// ── Derived KPI calculations ────────────────────────────────
function computeKPIs(machines) {
  if (!machines.length) return {};

  const total = machines.length;
  const healthy = machines.filter((m) => m.status === 'Healthy').length;
  const warning = machines.filter((m) => m.status === 'Warning').length;
  const critical = machines.filter((m) => m.status === 'Critical').length;

  const avgHealth = Math.round(machines.reduce((a, m) => a + m.healthScore, 0) / total);
  const avgUptime = (machines.reduce((a, m) => a + m.uptime, 0) / total).toFixed(1);

  // OEE = Availability × Performance × Quality (simplified)
  const availability = (healthy / total) * 100;
  const performance = parseFloat(avgUptime);
  const quality = 98.2; // enterprise constant
  const oee = ((availability / 100) * (performance / 100) * (quality / 100) * 100).toFixed(1);

  // MTBF: mean time between failures (hours) — derived from uptime
  const mtbf = Math.round((parseFloat(avgUptime) / 100) * 720); // monthly hours
  // MTTR: mean time to repair (hours)
  const mttr = critical > 0 ? Math.round(4 + critical * 1.5) : 2;

  // Downtime cost savings (hypothetical)
  const costSaved = ((avgHealth / 100) * 125000).toFixed(0);

  // Maintenance compliance
  const compliance = Math.round(85 + (avgHealth / 100) * 12);

  return {
    total, healthy, warning, critical,
    avgHealth, avgUptime, oee, mtbf, mttr,
    costSaved, quality, availability: availability.toFixed(1),
    compliance,
  };
}

export default function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [failureData, setFailureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadData = useCallback(async () => {
    try {
      const [machinesData, tsData, analyticsData] = await Promise.all([
        getMachines(),
        getMachineTimeSeries(),
        getAnalytics(),
      ]);
      setMachines(machinesData);
      setTimeSeriesData(tsData);
      setFailureData(analyticsData?.failureTrend || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  const kpis = computeKPIs(machines);

  const filteredMachines = machines.filter((m) => {
    const matchSearch =
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const criticalAlerts = machines
    .filter((m) => m.status === 'Critical')
    .map((m) => ({
      type: 'critical',
      title: `Machine ${m.id} — ${m.name}`,
      message: `Health Score: ${m.healthScore}% — Temperature: ${m.temperature}°C, Pressure: ${m.pressure} PSI`,
      details: `Vibration: ${m.vibration} | Uptime: ${m.uptime}% | Last Maintenance: ${m.lastMaintenance}`,
      timestamp: 'Just now',
    }));

  const warningAlerts = machines
    .filter((m) => m.status === 'Warning')
    .map((m) => ({
      type: 'warning',
      title: `Machine ${m.id} — ${m.name}`,
      message: `Health Score: ${m.healthScore}% — Requires attention`,
      details: `Temperature: ${m.temperature}°C | Pressure: ${m.pressure} PSI | Vibration: ${m.vibration}`,
      timestamp: '2 min ago',
    }));

  const alertsToShow = [
    ...criticalAlerts,
    ...warningAlerts,
    { type: 'info', title: 'ML Model Update', message: 'Predictive model v2.4 active — 94.7% accuracy maintained', timestamp: '5 min ago' },
  ].slice(0, 6);

  if (loading) return <SkeletonDashboard />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse shadow-sm shadow-success-500/60" />
            <span className="text-[11px] font-bold text-success-500 uppercase tracking-wider">Live Monitoring</span>
          </div>
          <h1 className="text-2xl font-black text-dark-900 dark:text-white">
            Operational Dashboard
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            Real-time factory-wide machine health and performance intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-dark-500 dark:text-dark-400">Last updated</p>
            <p className="text-xs font-bold text-dark-700 dark:text-dark-200">
              {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Critical Alert Banner ───────────────────────────── */}
      {kpis.critical > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-danger-500/10 border border-danger-500/30 animate-fade-in">
          <Zap className="h-5 w-5 text-danger-400 animate-pulse shrink-0" />
          <div className="flex-1 ticker-container">
            <div className="ticker-track text-sm font-semibold text-danger-300">
              {machines.filter(m => m.status === 'Critical').map(m =>
                `⚠ CRITICAL: ${m.id} ${m.name} — Health ${m.healthScore}% — Immediate Action Required  •  `
              ).join('')}
              {machines.filter(m => m.status === 'Critical').map(m =>
                `⚠ CRITICAL: ${m.id} ${m.name} — Health ${m.healthScore}% — Immediate Action Required  •  `
              ).join('')}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-danger-500 text-white text-[10px] font-bold shrink-0 animate-pulse">
            {kpis.critical} CRITICAL
          </span>
        </div>
      )}

      {/* ── Executive KPI Strip ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Assets" value={kpis.total} subtitle="Registered machines" icon={Server} color="primary" trend="0" trendNeutral />
        <StatCard title="Online Assets" value={kpis.healthy} subtitle="Healthy & operating" icon={Wifi} color="success" trend="2.3%" trendUp badge="LIVE" />
        <StatCard title="Warnings" value={kpis.warning} subtitle="Require attention" icon={AlertTriangle} color="warning" trend="1 fewer" trendUp />
        <StatCard title="Critical" value={kpis.critical} subtitle="Immediate action" icon={AlertCircle} color="danger" trend={kpis.critical > 0 ? 'Active' : 'Clear'} trendUp={kpis.critical === 0} />
      </div>

      {/* ── Secondary KPI Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="OEE Score"
          value={`${kpis.oee}%`}
          subtitle="Overall Equipment Effectiveness"
          icon={BarChart2}
          color="cyan"
          trend="1.2%"
          trendUp
        />
        <StatCard
          title="MTBF"
          value={`${kpis.mtbf}h`}
          subtitle="Mean Time Between Failures"
          icon={Clock}
          color="primary"
          trend="8h"
          trendUp
        />
        <StatCard
          title="MTTR"
          value={`${kpis.mttr}h`}
          subtitle="Mean Time To Repair"
          icon={Wrench}
          color="warning"
          trend="0.5h"
          trendUp
        />
        <StatCard
          title="Cost Avoided"
          value={`$${parseInt(kpis.costSaved).toLocaleString()}`}
          subtitle="Downtime savings this month"
          icon={DollarSign}
          color="success"
          trend="12.5%"
          trendUp
        />
      </div>

      {/* ── Tertiary KPI Row ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Plant Health"
          value={`${kpis.avgHealth}%`}
          subtitle="Composite health score"
          icon={Activity}
          color="success"
          trend="2.1%"
          trendUp
        />
        <StatCard
          title="Availability"
          value={`${kpis.availability}%`}
          subtitle="Asset uptime rate"
          icon={TrendingUp}
          color="primary"
          trend="0.8%"
          trendUp
        />
        <StatCard
          title="Quality Rate"
          value={`${kpis.quality}%`}
          subtitle="Production quality index"
          icon={Shield}
          color="cyan"
          trend="0.3%"
          trendUp
        />
        <StatCard
          title="Compliance"
          value={`${kpis.compliance}%`}
          subtitle="Maintenance compliance"
          icon={Zap}
          color="violet"
          trend="3%"
          trendUp
        />
      </div>

      {/* ── Live Charts ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LiveChart
          title="Temperature (°C)"
          subtitle="Live sensor readings"
          data={timeSeriesData}
          type="line"
          dataKeys={['time', 'temperature']}
          colors={['#ef4444']}
          height={220}
          thresholds={[{ value: 90, label: 'Threshold', color: '#f59e0b' }]}
        />
        <LiveChart
          title="Vibration Levels"
          subtitle="Real-time vibration monitoring"
          data={timeSeriesData}
          type="area"
          dataKeys={['time', 'vibration']}
          colors={['#8b5cf6']}
          height={220}
        />
        <LiveChart
          title="Failure Count"
          subtitle="Actual vs Predicted"
          data={failureData}
          type="bar"
          dataKeys={['month', 'failures', 'predicted']}
          colors={['#ef4444', '#8b5cf6']}
          height={220}
        />
      </div>

      {/* ── Machine Status Grid ──────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-black text-dark-900 dark:text-white">Machine Status</h2>
            <p className="text-xs text-dark-500 dark:text-dark-400">
              {filteredMachines.length} of {machines.length} machines shown
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-400" />
              <input
                type="text"
                placeholder="Search machines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 w-44 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none transition-all cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredMachines.map((machine, i) => (
            <div key={machine.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-in">
              <MachineCard machine={machine} />
            </div>
          ))}
          {filteredMachines.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Server className="h-12 w-12 text-dark-300 dark:text-dark-600 mx-auto mb-3" />
              <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">No machines match your criteria</p>
              <button onClick={() => { setSearch(''); setStatusFilter('All'); }} className="mt-3 text-xs text-primary-500 hover:text-primary-400 font-semibold">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Alerts ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-dark-900 dark:text-white">Active Alerts</h2>
            <p className="text-xs text-dark-500 dark:text-dark-400">{alertsToShow.filter(a => a.type === 'critical').length} critical, {alertsToShow.filter(a => a.type === 'warning').length} warnings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alertsToShow.map((alert, i) => (
            <AlertBox key={i} {...alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
