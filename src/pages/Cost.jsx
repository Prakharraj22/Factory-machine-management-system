import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Database, HardDrive, TrendingDown, DollarSign, Download, Lightbulb } from 'lucide-react';
import StatCard from '../components/StatCard';
import LiveChart from '../components/LiveChart';
import { SkeletonDashboard } from '../components/SkeletonLoader';
import { getCostData } from '../services/api';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

export default function Cost() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getCostData();
        setData(result);
      } catch (err) {
        console.error('Failed to load cost data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <SkeletonDashboard />;
  if (!data) return <p className="text-dark-400 p-8">Failed to load cost data.</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-900 dark:text-white">Cost Optimization</h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            AWS infrastructure cost analysis, savings tracking, and optimization intelligence
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800 dark:bg-dark-700 text-white text-xs font-bold hover:bg-dark-700 transition-colors self-start">
          <Download className="h-3.5 w-3.5" />
          Export Report
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Data Stored" value={data.totalData} subtitle="Across all storage tiers" icon={Database} color="primary" trend="11%" trendUp />
        <StatCard title="Intelligent Tiering" value={data.intelligentTier} subtitle="Auto-optimized storage" icon={HardDrive} color="success" trend="15%" trendUp />
        <StatCard title="Est. Cost Savings" value={data.estimatedSavings} subtitle="vs. standard storage" icon={TrendingDown} color="warning" trend="5%" trendUp />
        <StatCard title="Monthly Cost" value={`$${data.monthlyCost}`} subtitle="Current billing cycle" icon={DollarSign} color="danger" trend="3.2%" trendUp={false} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveChart
          title="Storage Growth Over Time"
          subtitle="GB stored by month"
          data={data.storageGrowth}
          type="area"
          dataKeys={['month', 'storage']}
          colors={['#06b6d4']}
          height={280}
        />
        <LiveChart
          title="Monthly Cost Trend"
          subtitle="AWS infrastructure spend"
          data={data.storageGrowth}
          type="line"
          dataKeys={['month', 'cost']}
          colors={['#ef4444']}
          height={280}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveChart
          title="Savings Trend (%)"
          subtitle="Cost reduction percentage"
          data={data.savingsTrend}
          type="bar"
          dataKeys={['month', 'savings']}
          colors={['#22c55e']}
          height={280}
        />

        {/* Cost Breakdown Pie */}
        <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-dark-800 dark:text-white">Cost by AWS Service</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data.costBreakdown}
                innerRadius="50%"
                outerRadius="75%"
                dataKey="value"
                stroke="none"
                paddingAngle={3}
              >
                {data.costBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => `$${val}`}
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
          <div className="grid grid-cols-2 gap-2 mt-2">
            {data.costBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-[11px] text-dark-600 dark:text-dark-400 truncate">{item.name}</span>
                <span className="text-[11px] font-bold text-dark-800 dark:text-white ml-auto">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="h-5 w-5 text-warning-400" />
          <h3 className="text-sm font-bold text-dark-800 dark:text-white">AI Optimization Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data.recommendations || []).map((rec) => (
            <div
              key={rec.title}
              className="p-4 rounded-xl bg-dark-50 dark:bg-dark-900/60 border border-dark-200 dark:border-dark-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                  rec.priority === 'High' ? 'bg-danger-500' :
                  rec.priority === 'Medium' ? 'bg-warning-500' : 'bg-success-500'
                }`}>
                  {rec.priority} Priority
                </span>
                <span className="text-sm font-black text-success-500">Save {rec.savings}</span>
              </div>
              <h4 className="text-sm font-bold text-dark-800 dark:text-white mb-1">{rec.title}</h4>
              <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed">{rec.desc}</p>
              <button className="mt-3 w-full py-2 rounded-lg text-xs font-bold text-primary-400 border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500 hover:text-white transition-all duration-200">
                Apply Recommendation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
