import { useState, useEffect } from 'react';
import {
  Users, Shield, Activity as ActivityIcon, CheckCircle, XCircle,
  AlertTriangle, Clock, Edit, Trash2, UserPlus, RefreshCw,
  Server, Database, Zap, Globe, Cloud,
} from 'lucide-react';
import DataTable from '../components/DataTable';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { getActivityLogs } from '../services/api';

const TABS = ['System Health', 'User Management', 'Audit Logs'];

const roleColors = {
  Admin: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
  Engineer: 'bg-primary-500/15 text-primary-400 border border-primary-500/20',
  Viewer: 'bg-success-500/15 text-success-400 border border-success-500/20',
};

const logTypeConfig = {
  system: { icon: Server, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  view: { icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  update: { icon: Edit, color: 'text-warning-400', bg: 'bg-warning-500/10' },
  export: { icon: ActivityIcon, color: 'text-success-400', bg: 'bg-success-500/10' },
  security: { icon: Shield, color: 'text-danger-400', bg: 'bg-danger-500/10' },
};

const serviceIcons = {
  'AWS Lambda': Zap,
  'AWS Glue': Database,
  'Amazon Athena': Globe,
  'Amazon Kinesis': ActivityIcon,
  'Amazon S3': Cloud,
};

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('System Health');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getActivityLogs();
        setData(result);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <SkeletonDashboard />;
  if (!data) return <p className="text-dark-400 p-8">Failed to load admin data.</p>;

  const userColumns = [
    { key: 'name', label: 'User' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${roleColors[val] || ''}`}>{val}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <div className={`flex items-center gap-1.5 ${val === 'Active' ? 'text-success-500' : 'text-dark-400'}`}>
          {val === 'Active' ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          <span className="text-xs font-semibold">{val}</span>
        </div>
      ),
    },
    { key: 'lastLogin', label: 'Last Login' },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors" title="Edit">
            <Edit className="h-3.5 w-3.5 text-primary-500" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-warning-50 dark:hover:bg-warning-500/10 transition-colors" title="Disable">
            <AlertTriangle className="h-3.5 w-3.5 text-warning-500" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors" title="Remove">
            <Trash2 className="h-3.5 w-3.5 text-danger-500" />
          </button>
        </div>
      ),
    },
  ];

  const operationalServices = data.services.filter((s) => s.status === 'Operational').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-900 dark:text-white">Admin Panel</h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            System health, user management, security monitoring, and audit trails
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success-500/10 border border-success-500/20">
            <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-bold text-success-400">{operationalServices}/{data.services.length} Services Online</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
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

      {/* ── System Health Tab ───────────────────────────────── */}
      {activeTab === 'System Health' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {data.services.map((service) => {
              const Icon = serviceIcons[service.name] || Server;
              return (
                <div
                  key={service.name}
                  className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/15">
                      <Icon className="h-4 w-4 text-primary-400" />
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                      service.status === 'Operational'
                        ? 'bg-success-500/15 text-success-400'
                        : service.status === 'Degraded'
                        ? 'bg-warning-500/15 text-warning-400'
                        : 'bg-danger-500/15 text-danger-400'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        service.status === 'Operational' ? 'bg-success-400' :
                        service.status === 'Degraded' ? 'bg-warning-400 animate-pulse' :
                        'bg-danger-400 animate-pulse'
                      }`} />
                      {service.status}
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-dark-800 dark:text-white mb-2">{service.name}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-dark-400">Uptime</span>
                      <span className="font-bold text-success-400">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-dark-400">Last Check</span>
                      <span className="text-dark-500 dark:text-dark-400">{service.lastCheck}</span>
                    </div>
                  </div>
                  {/* Uptime bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-dark-200 dark:bg-dark-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full"
                      style={{ width: service.uptime }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* API Health Summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-success-500/10 border border-success-500/20 p-4 text-center">
              <p className="text-3xl font-black text-success-400">{operationalServices}</p>
              <p className="text-xs font-semibold text-success-500 mt-1">Services Operational</p>
            </div>
            <div className="rounded-2xl bg-warning-500/10 border border-warning-500/20 p-4 text-center">
              <p className="text-3xl font-black text-warning-400">{data.services.filter(s => s.status === 'Degraded').length}</p>
              <p className="text-xs font-semibold text-warning-500 mt-1">Services Degraded</p>
            </div>
            <div className="rounded-2xl bg-primary-500/10 border border-primary-500/20 p-4 text-center">
              <p className="text-3xl font-black text-primary-400">99.9%</p>
              <p className="text-xs font-semibold text-primary-400 mt-1">Platform SLA</p>
            </div>
          </div>
        </div>
      )}

      {/* ── User Management Tab ─────────────────────────────── */}
      {activeTab === 'User Management' && (
        <DataTable
          title="User Management"
          columns={userColumns}
          data={data.users}
          searchable
          exportable
          pageSize={10}
        />
      )}

      {/* ── Audit Logs Tab ──────────────────────────────────── */}
      {activeTab === 'Audit Logs' && (
        <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-200 dark:border-dark-700">
            <div>
              <h3 className="text-sm font-bold text-dark-800 dark:text-white">Activity Logs (CloudTrail)</h3>
              <p className="text-[11px] text-dark-400 mt-0.5">{data.logs.length} events recorded today</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-100 dark:bg-dark-700 text-xs font-semibold text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <div className="divide-y divide-dark-100 dark:divide-dark-700/50">
            {data.logs.map((log) => {
              const lc = logTypeConfig[log.type] || logTypeConfig.system;
              const Icon = lc.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-dark-50 dark:hover:bg-dark-700/30 transition-colors group"
                >
                  <div className={`shrink-0 p-2 rounded-lg ${lc.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${lc.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-dark-800 dark:text-white">{log.user}</span>
                      <span className="text-xs text-dark-500 dark:text-dark-400">{log.action}</span>
                    </div>
                    <span className="text-[10px] text-dark-400">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-dark-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-[11px] font-medium">{log.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
