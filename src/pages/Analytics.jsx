import { useState, useEffect } from 'react';
import { Thermometer, Gauge, AlertTriangle, Activity, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import LiveChart from '../components/LiveChart';
import DataTable from '../components/DataTable';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { getAnalytics } from '../services/api';

const TABS = ['Overview', 'Trends', 'Performance', 'Machines'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <SkeletonDashboard />;
  if (!data) return <p className="text-dark-400 p-8">Failed to load analytics data.</p>;

  const tableColumns = [
    { key: 'machine', label: 'Machine ID' },
    { key: 'name', label: 'Machine Name' },
    {
      key: 'avgTemperature',
      label: 'Avg Temp (°C)',
      render: (val) => (
        <span className={`font-bold ${val > 85 ? 'text-danger-500' : val > 70 ? 'text-warning-500' : 'text-success-500'}`}>
          {val}°C
        </span>
      ),
    },
    {
      key: 'avgPressure',
      label: 'Avg Pressure',
      render: (val) => <span className="font-medium text-dark-700 dark:text-dark-200">{val} PSI</span>,
    },
    {
      key: 'failureCount',
      label: 'Failures',
      render: (val) => (
        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
          val > 5 ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400'
          : val > 2 ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400'
          : 'bg-success-100 text-success-700 dark:bg-success-500/20 dark:text-success-400'
        }`}>
          {val}
        </span>
      ),
    },
    { key: 'lastMaintenance', label: 'Last Maintenance' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-900 dark:text-white">Historical Analytics</h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            Comprehensive historical data, trends, and machine performance analysis
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800 dark:bg-dark-700 text-white text-xs font-bold hover:bg-dark-700 dark:hover:bg-dark-600 transition-colors self-start">
          <Download className="h-3.5 w-3.5" />
          Export Report
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white dark:bg-dark-900 text-dark-900 dark:text-white shadow-sm'
                : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Temperature"
          value={`${data.metrics.avgTemperature}°C`}
          subtitle="Fleet average"
          icon={Thermometer}
          color="danger"
          trend="2.1°C"
          trendUp
        />
        <StatCard
          title="Avg Pressure"
          value={`${data.metrics.avgPressure} PSI`}
          subtitle="Fleet average"
          icon={Gauge}
          color="primary"
          trend="0.8 PSI"
          trendUp={false}
        />
        <StatCard
          title="Failure Frequency"
          value={`${data.metrics.failureFrequency}/mo`}
          subtitle="Monthly average"
          icon={AlertTriangle}
          color="warning"
          trend="12%"
          trendUp={false}
        />
        <StatCard
          title="Machine Utilization"
          value={`${data.metrics.machineUtilization}%`}
          subtitle="Overall efficiency"
          icon={Activity}
          color="success"
          trend="3.4%"
          trendUp
        />
      </div>

      {/* Charts — conditional by tab */}
      {(activeTab === 'Overview' || activeTab === 'Trends') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveChart
            title="Temperature & Pressure Trend"
            subtitle="12-hour rolling average"
            data={data.temperatureTrend}
            type="line"
            dataKeys={['time', 'temperature', 'pressure']}
            colors={['#ef4444', '#3b82f6']}
            height={300}
            thresholds={[{ value: 90, label: 'Critical Temp', color: '#ef4444' }]}
          />
          <LiveChart
            title="Failure Trend (Actual vs Predicted)"
            subtitle="Monthly comparison"
            data={data.failureTrend}
            type="bar"
            dataKeys={['month', 'failures', 'predicted']}
            colors={['#ef4444', '#8b5cf6']}
            height={300}
          />
        </div>
      )}

      {(activeTab === 'Overview' || activeTab === 'Performance') && (
        <LiveChart
          title="Machine Performance Comparison"
          subtitle="Efficiency & uptime by machine"
          data={data.performanceComparison}
          type="bar"
          dataKeys={['machine', 'efficiency', 'uptime']}
          colors={['#3b82f6', '#22c55e']}
          height={320}
        />
      )}

      {(activeTab === 'Overview' || activeTab === 'Machines') && (
        <DataTable
          title="Machine Historical Data"
          columns={tableColumns}
          data={data.historicalTable}
          searchable
          exportable
          pageSize={10}
        />
      )}
    </div>
  );
}
