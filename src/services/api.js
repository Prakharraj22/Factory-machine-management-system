import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('factory_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Mock Data ────────────────────────────────────────────

const MACHINES = [
  { id: 'M101', name: 'CNC Router Alpha', temperature: 85, pressure: 40, vibration: 'HIGH', healthScore: 72, status: 'Warning', uptime: 94, lastMaintenance: '2025-05-10' },
  { id: 'M102', name: 'Hydraulic Press B2', temperature: 92, pressure: 48, vibration: 'CRITICAL', healthScore: 45, status: 'Critical', uptime: 78, lastMaintenance: '2025-04-15' },
  { id: 'M103', name: 'Conveyor Line C3', temperature: 62, pressure: 32, vibration: 'LOW', healthScore: 96, status: 'Healthy', uptime: 99, lastMaintenance: '2025-06-01' },
  { id: 'M104', name: 'Welding Robot D4', temperature: 78, pressure: 38, vibration: 'MEDIUM', healthScore: 88, status: 'Healthy', uptime: 97, lastMaintenance: '2025-05-28' },
  { id: 'M105', name: 'Assembly Arm E5', temperature: 70, pressure: 35, vibration: 'LOW', healthScore: 93, status: 'Healthy', uptime: 98, lastMaintenance: '2025-05-20' },
  { id: 'M106', name: 'Packaging Unit F6', temperature: 65, pressure: 30, vibration: 'LOW', healthScore: 97, status: 'Healthy', uptime: 99, lastMaintenance: '2025-06-02' },
  { id: 'M107', name: 'Laser Cutter G7', temperature: 88, pressure: 42, vibration: 'HIGH', healthScore: 68, status: 'Warning', uptime: 91, lastMaintenance: '2025-04-28' },
  { id: 'M108', name: 'Drill Press H8', temperature: 58, pressure: 28, vibration: 'LOW', healthScore: 95, status: 'Healthy', uptime: 99, lastMaintenance: '2025-05-30' },
  { id: 'M109', name: 'Milling Machine I9', temperature: 72, pressure: 36, vibration: 'MEDIUM', healthScore: 84, status: 'Healthy', uptime: 96, lastMaintenance: '2025-05-15' },
  { id: 'M110', name: 'Stamping Press J10', temperature: 95, pressure: 50, vibration: 'HIGH', healthScore: 58, status: 'Warning', uptime: 85, lastMaintenance: '2025-04-10' },
  { id: 'M111', name: 'Injection Molder K11', temperature: 60, pressure: 33, vibration: 'LOW', healthScore: 94, status: 'Healthy', uptime: 98, lastMaintenance: '2025-05-25' },
  { id: 'M112', name: 'Paint Sprayer L12', temperature: 55, pressure: 25, vibration: 'LOW', healthScore: 98, status: 'Healthy', uptime: 99, lastMaintenance: '2025-06-01' },
  { id: 'M113', name: 'Forklift AGV M13', temperature: 68, pressure: 34, vibration: 'MEDIUM', healthScore: 86, status: 'Healthy', uptime: 95, lastMaintenance: '2025-05-18' },
  { id: 'M114', name: 'Quality Scanner N14', temperature: 52, pressure: 22, vibration: 'LOW', healthScore: 99, status: 'Healthy', uptime: 100, lastMaintenance: '2025-06-02' },
  { id: 'M115', name: 'Turbine Generator O15', temperature: 76, pressure: 39, vibration: 'MEDIUM', healthScore: 82, status: 'Healthy', uptime: 93, lastMaintenance: '2025-05-12' },
  { id: 'M116', name: 'Compressor P16', temperature: 64, pressure: 31, vibration: 'LOW', healthScore: 91, status: 'Healthy', uptime: 97, lastMaintenance: '2025-05-22' },
  { id: 'M117', name: 'Heat Exchanger Q17', temperature: 82, pressure: 44, vibration: 'MEDIUM', healthScore: 79, status: 'Healthy', uptime: 92, lastMaintenance: '2025-05-08' },
  { id: 'M118', name: 'Centrifuge R18', temperature: 69, pressure: 37, vibration: 'LOW', healthScore: 90, status: 'Healthy', uptime: 96, lastMaintenance: '2025-05-26' },
  { id: 'M119', name: 'Reactor Vessel S19', temperature: 74, pressure: 41, vibration: 'MEDIUM', healthScore: 85, status: 'Healthy', uptime: 94, lastMaintenance: '2025-05-14' },
  { id: 'M120', name: 'Cooling Tower T20', temperature: 48, pressure: 20, vibration: 'LOW', healthScore: 97, status: 'Healthy', uptime: 99, lastMaintenance: '2025-06-01' },
];

function generateTimeSeriesData(points = 24) {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: 60 + Math.random() * 40,
      vibration: 10 + Math.random() * 50,
      pressure: 20 + Math.random() * 30,
    });
  }
  return data;
}

function generateFailureData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    failures: Math.floor(Math.random() * 12) + 1,
    predicted: Math.floor(Math.random() * 8) + 1,
  }));
}

const ANALYTICS_DATA = {
  metrics: {
    avgTemperature: 73.2,
    avgPressure: 35.4,
    failureFrequency: 4.2,
    machineUtilization: 94.1,
  },
  historicalTable: MACHINES.map((m) => ({
    machine: m.id,
    name: m.name,
    avgTemperature: m.temperature + Math.floor(Math.random() * 10 - 5),
    avgPressure: m.pressure + Math.floor(Math.random() * 6 - 3),
    failureCount: Math.floor(Math.random() * 10),
    lastMaintenance: m.lastMaintenance,
  })),
  temperatureTrend: generateTimeSeriesData(12),
  failureTrend: generateFailureData(),
  performanceComparison: MACHINES.slice(0, 8).map((m) => ({
    machine: m.id,
    efficiency: 70 + Math.random() * 30,
    uptime: m.uptime,
  })),
};

const PREDICTIONS = [
  { machine: 'M101', name: 'CNC Router Alpha', failureProbability: 85, riskLevel: 'High', reason: 'High vibration detected + elevated temperature', recommendation: 'Schedule maintenance within 24 hours', nextFailure: '2-3 days' },
  { machine: 'M102', name: 'Hydraulic Press B2', failureProbability: 92, riskLevel: 'Critical', reason: 'Pressure anomaly and bearing wear detected', recommendation: 'Immediate inspection required', nextFailure: '< 24 hours' },
  { machine: 'M103', name: 'Conveyor Line C3', failureProbability: 12, riskLevel: 'Low', reason: 'Normal operating parameters', recommendation: 'Continue regular maintenance schedule', nextFailure: '> 30 days' },
  { machine: 'M104', name: 'Welding Robot D4', failureProbability: 35, riskLevel: 'Medium', reason: 'Minor vibration increase trend', recommendation: 'Monitor closely for next 7 days', nextFailure: '15-20 days' },
  { machine: 'M107', name: 'Laser Cutter G7', failureProbability: 78, riskLevel: 'High', reason: 'Optical alignment degradation', recommendation: 'Schedule recalibration within 48 hours', nextFailure: '4-5 days' },
  { machine: 'M110', name: 'Stamping Press J10', failureProbability: 87, riskLevel: 'High', reason: 'Temperature threshold exceeded multiple times', recommendation: 'Replace cooling unit', nextFailure: '1-2 days' },
  { machine: 'M109', name: 'Milling Machine I9', failureProbability: 28, riskLevel: 'Low', reason: 'Slight tool wear detected', recommendation: 'Plan tool replacement in next cycle', nextFailure: '> 20 days' },
  { machine: 'M117', name: 'Heat Exchanger Q17', failureProbability: 55, riskLevel: 'Medium', reason: 'Fouling detected in heat transfer plates', recommendation: 'Schedule cleaning within 1 week', nextFailure: '10-12 days' },
];

const COST_DATA = {
  totalData: '500 GB',
  intelligentTier: '300 GB',
  estimatedSavings: '40%',
  monthlyCost: 120,
  storageGrowth: [
    { month: 'Jan', storage: 280, cost: 95 },
    { month: 'Feb', storage: 310, cost: 100 },
    { month: 'Mar', storage: 350, cost: 105 },
    { month: 'Apr', storage: 400, cost: 110 },
    { month: 'May', storage: 450, cost: 115 },
    { month: 'Jun', storage: 500, cost: 120 },
  ],
  savingsTrend: [
    { month: 'Jan', savings: 25 },
    { month: 'Feb', savings: 28 },
    { month: 'Mar', savings: 32 },
    { month: 'Apr', savings: 35 },
    { month: 'May', savings: 38 },
    { month: 'Jun', savings: 40 },
  ],
  costBreakdown: [
    { name: 'S3 Storage', value: 45 },
    { name: 'Lambda', value: 25 },
    { name: 'Glue ETL', value: 20 },
    { name: 'Athena', value: 15 },
    { name: 'Kinesis', value: 15 },
  ],
  recommendations: [
    {
      title: 'Enable S3 Lifecycle Policies',
      desc: 'Automatically transition infrequently accessed data to Glacier for 60% cost reduction',
      savings: '$48/mo',
      priority: 'High',
    },
    {
      title: 'Optimize Lambda Memory',
      desc: 'Right-size Lambda functions based on CloudWatch metrics to reduce invocation costs',
      savings: '$12/mo',
      priority: 'Medium',
    },
    {
      title: 'Use Athena Query Caching',
      desc: 'Enable result caching for frequently run queries to reduce scan costs',
      savings: '$8/mo',
      priority: 'Low',
    },
  ],
};

const USERS = [
  { id: 1, name: 'John Admin', email: 'admin@factory.com', role: 'Admin', status: 'Active', lastLogin: '2025-06-03 10:45 AM' },
  { id: 2, name: 'Sarah Engineer', email: 'engineer@factory.com', role: 'Engineer', status: 'Active', lastLogin: '2025-06-03 11:05 AM' },
  { id: 3, name: 'Mike Viewer', email: 'viewer@factory.com', role: 'Viewer', status: 'Active', lastLogin: '2025-06-02 03:30 PM' },
  { id: 4, name: 'Emily Ops', email: 'ops@factory.com', role: 'Engineer', status: 'Inactive', lastLogin: '2025-05-28 09:15 AM' },
  { id: 5, name: 'David Manager', email: 'manager@factory.com', role: 'Admin', status: 'Active', lastLogin: '2025-06-03 08:30 AM' },
];

const ACTIVITY_LOGS = [
  { id: 1, user: 'Admin', action: 'Started Glue Job', time: '10:45 AM', date: '2025-06-03', type: 'system' },
  { id: 2, user: 'Engineer', action: 'Viewed Predictions', time: '11:05 AM', date: '2025-06-03', type: 'view' },
  { id: 3, user: 'System', action: 'Lambda Function Triggered', time: '11:15 AM', date: '2025-06-03', type: 'system' },
  { id: 4, user: 'Admin', action: 'Updated Machine M101 Config', time: '11:30 AM', date: '2025-06-03', type: 'update' },
  { id: 5, user: 'Engineer', action: 'Exported Analytics Report', time: '11:45 AM', date: '2025-06-03', type: 'export' },
  { id: 6, user: 'System', action: 'Kinesis Stream Processed 1000 Records', time: '12:00 PM', date: '2025-06-03', type: 'system' },
  { id: 7, user: 'Viewer', action: 'Accessed Dashboard', time: '12:15 PM', date: '2025-06-03', type: 'view' },
  { id: 8, user: 'Admin', action: 'Modified IAM Role', time: '12:30 PM', date: '2025-06-03', type: 'security' },
  { id: 9, user: 'System', action: 'S3 Lifecycle Policy Applied', time: '01:00 PM', date: '2025-06-03', type: 'system' },
  { id: 10, user: 'Engineer', action: 'Scheduled Maintenance for M107', time: '01:15 PM', date: '2025-06-03', type: 'update' },
];

const SYSTEM_SERVICES = [
  { name: 'AWS Lambda', status: 'Operational', uptime: '99.99%', lastCheck: '2 min ago' },
  { name: 'AWS Glue', status: 'Operational', uptime: '99.95%', lastCheck: '5 min ago' },
  { name: 'Amazon Athena', status: 'Operational', uptime: '99.98%', lastCheck: '1 min ago' },
  { name: 'Amazon Kinesis', status: 'Degraded', uptime: '98.50%', lastCheck: '3 min ago' },
  { name: 'Amazon S3', status: 'Operational', uptime: '99.99%', lastCheck: '1 min ago' },
];

// ─── API Functions ────────────────────────────────────────

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const isPlaceholderBase = () => {
  return !API_BASE || API_BASE.includes('YOUR-API-ID');
};

export async function getMachines() {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Using mock data for getMachines.`);
    await delay(300);
    return MACHINES.map(m => ({
  ...m,
  temperature: m.temperature + Math.floor(Math.random() * 10 - 5),
  pressure: m.pressure + Math.floor(Math.random() * 6 - 3),
  healthScore: Math.max(
    0,
    Math.min(
      100,
      m.healthScore + Math.floor(Math.random() * 10 - 5)
    )
  )
}));
  }
  try {
    const res = await api.get('/machines');
    return res.data;
  } catch (err) {
    console.error('API Error in getMachines, falling back to mock data:', err);
    return MACHINES.map(m => ({
  ...m,
  temperature: m.temperature + Math.floor(Math.random() * 10 - 5),
  pressure: m.pressure + Math.floor(Math.random() * 6 - 3),
  healthScore: Math.max(
    0,
    Math.min(
      100,
      m.healthScore + Math.floor(Math.random() * 10 - 5)
    )
  )
}));
  }
}

export async function getMachineTimeSeries() {
  if (isPlaceholderBase()) {
    await delay(200);
    return generateTimeSeriesData();
  }
  try {
    const res = await api.get('/machines/timeseries');
    return res.data;
  } catch (err) {
    console.error('API Error in getMachineTimeSeries, falling back to mock data:', err);
    return generateTimeSeriesData();
  }
}

export async function getAnalytics() {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Using mock data for getAnalytics.`);
    await delay(400);
    return ANALYTICS_DATA;
  }
  try {
    const res = await api.get('/analytics');
    return res.data;
  } catch (err) {
    console.error('API Error in getAnalytics, falling back to mock data:', err);
    return ANALYTICS_DATA;
  }
}

export async function getPredictions() {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Using mock data for getPredictions.`);
    await delay(350);
    return PREDICTIONS;
  }
  try {
    const res = await api.get('/predictions');
    return res.data;
  } catch (err) {
    console.error('API Error in getPredictions, falling back to mock data:', err);
    return PREDICTIONS;
  }
}

export async function getCostData() {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Using mock data for getCostData.`);
    await delay(300);
    return COST_DATA;
  }
  try {
    const res = await api.get('/costs');
    return res.data;
  } catch (err) {
    console.error('API Error in getCostData, falling back to mock data:', err);
    return COST_DATA;
  }
}

export async function getActivityLogs() {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Using mock data for getActivityLogs.`);
    await delay(250);
    return { users: USERS, logs: ACTIVITY_LOGS, services: SYSTEM_SERVICES };
  }
  try {
    const res = await api.get('/activity');
    return res.data;
  } catch (err) {
    console.error('API Error in getActivityLogs, falling back to mock data:', err);
    return { users: USERS, logs: ACTIVITY_LOGS, services: SYSTEM_SERVICES };
  }
}

export async function loginUser(email, password) {
  if (isPlaceholderBase()) {
    console.warn(`[API Fallback] VITE_API_URL is unconfigured. Performing mock authentication.`);
    await delay(500);
    // Find matching mock user
    const formattedEmail = email.toLowerCase();
    let name = 'Demo User';
    let role = 'Viewer';
    
    if (formattedEmail.includes('admin')) {
      name = 'John Admin';
      role = 'Admin';
    } else if (formattedEmail.includes('engineer')) {
      name = 'Sarah Engineer';
      role = 'Engineer';
    } else if (formattedEmail.includes('viewer')) {
      name = 'Mike Viewer';
      role = 'Viewer';
    }
    
    return {
      email,
      name,
      role,
      token: 'mock-jwt-token-12345'
    };
  }

  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export default api;
