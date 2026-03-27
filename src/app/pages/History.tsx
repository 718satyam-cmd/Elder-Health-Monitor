import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Activity, Heart, Thermometer, Droplets, Footprints, AlertTriangle, Pill, Stethoscope, ArrowLeft, Calendar, TrendingUp, TrendingDown, Minus, Download, Filter } from 'lucide-react';
import { mockHealthHistory, mockElders } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patientId } = useParams();
  const [metricFilter, setMetricFilter] = useState<'all' | 'bloodPressure' | 'heartRate' | 'steps' | 'oxygen' | 'temperature'>('all');
  const [showCharts, setShowCharts] = useState(true);
  const [chartView, setChartView] = useState<'trends' | 'distribution' | 'summary'>('trends');
  const [filter, setFilter] = useState<'all' | 'vital' | 'symptom' | 'activity' | 'medication'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Process data for charts
  const getChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayVitals = history.filter(h =>
        h.date.startsWith(dateStr) && h.type === 'vital'
      );

      const bloodPressure = dayVitals.find(v => v.title.includes('Blood Pressure'));
      const heartRate = dayVitals.find(v => v.title.includes('Heart Rate'));
      const oxygen = dayVitals.find(v => v.title.includes('Blood Oxygen'));
      const temperature = dayVitals.find(v => v.title.includes('Temperature'));
      const steps = history.find(h =>
        h.date.startsWith(dateStr) && h.type === 'activity' && h.title.includes('Steps')
      );

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bloodPressure: bloodPressure ? parseInt(bloodPressure.value.split('/')[0]) : null,
        heartRate: heartRate ? parseInt(heartRate.value) : null,
        oxygen: oxygen ? parseInt(oxygen.value) : null,
        temperature: temperature ? parseFloat(temperature.value) : null,
        steps: steps ? parseInt(steps.value.replace(',', '')) : null,
      });
    }

    return data;
  };

  const getMetricDistribution = () => {
    const metrics = history.filter(h => h.type === 'vital').reduce((acc, item) => {
      if (item.title.includes('Blood Pressure')) acc.bloodPressure++;
      else if (item.title.includes('Heart Rate')) acc.heartRate++;
      else if (item.title.includes('Blood Oxygen')) acc.oxygen++;
      else if (item.title.includes('Temperature')) acc.temperature++;
      return acc;
    }, { bloodPressure: 0, heartRate: 0, oxygen: 0, temperature: 0 });

    return Object.entries(metrics).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value,
      fill: key === 'bloodPressure' ? '#ef4444' : key === 'heartRate' ? '#f97316' : key === 'oxygen' ? '#22c55e' : '#3b82f6'
    }));
  };

  // Filter history based on user role and patient ID
  const getFilteredHistory = () => {
    let history = mockHealthHistory;

    if (user?.role === 'care-manager') {
      history = patientId
        ? history.filter(h => h.patientId === patientId)
        : history;
    } else {
      // For parents/family members, show only their own history
      history = history.filter(h => h.patientId === '1');
    }

    if (filter !== 'all') {
      history = history.filter(h => h.type === filter);
    }

    // Filter by time range (mock implementation)
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    history = history.filter(h => new Date(h.date) >= cutoffDate);

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const history = getFilteredHistory();
  const patient = patientId ? mockElders.find(e => e.id === patientId) : null;
  const chartData = getChartData();
  const metricDistribution = getMetricDistribution();

  const chartConfig = {
    bloodPressure: {
      label: 'Blood Pressure',
      color: 'hsl(var(--chart-1))',
    },
    heartRate: {
      label: 'Heart Rate',
      color: 'hsl(var(--chart-2))',
    },
    oxygen: {
      label: 'Oxygen',
      color: 'hsl(var(--chart-3))',
    },
    temperature: {
      label: 'Temperature',
      color: 'hsl(var(--chart-4))',
    },
    steps: {
      label: 'Steps',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'vital': return <Heart className="h-4 w-4 text-red-500" />;
      case 'symptom': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'activity': return <Footprints className="h-4 w-4 text-blue-500" />;
      case 'medication': return <Pill className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHistoryTypeColor = (type: string) => {
    switch (type) {
      case 'vital': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'symptom': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'activity': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medication': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTrendIcon = (type: string, value?: string) => {
    // Mock trend logic - in real app this would compare with previous values
    if (!value || type === 'symptom') return <Minus className="h-3 w-3 text-gray-400" />;

    const random = Math.random();
    if (random > 0.6) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (random > 0.3) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getStatsForType = (type: string) => {
    const typeHistory = history.filter(h => h.type === type);
    return {
      count: typeHistory.length,
      latest: typeHistory[0]?.date || null,
      average: type === 'activity' ? '6,247 steps' : type === 'vital' ? '72 bpm' : 'N/A'
    };
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Date', 'Type', 'Title', 'Value', 'Notes'],
        ...history.map(h => [
          new Date(h.date).toLocaleDateString(),
          h.type,
          h.title,
          h.value || '',
          h.notes || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    // PDF export would require additional library like jsPDF
    toast.success(`${format.toUpperCase()} export completed`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">
                📈 Health History
              </h1>
              <p className="text-muted-foreground">
                {patient ? `Health history for ${patient.name}` : 'View and analyze health data over time'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={metricFilter} onValueChange={(value) => setMetricFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter metrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                <SelectItem value="heartRate">Heart Rate</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="oxygen">Oxygen</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showCharts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
            >
              📊 Charts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              📥 Export CSV
            </Button>
          </div>
        </div>

        {/* Health Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-800 border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">Health Trend</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Vitals improving over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200">Activity Level</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Above average this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Pill className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-purple-800 dark:text-purple-200">Medication</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">All doses taken on time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Info (for care manager view) */}
        {patient && (
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold dark:text-white">{patient.name}</h3>
                  <p className="text-muted-foreground">Age: {patient.age}</p>
                  <p className="text-sm text-muted-foreground">
                    Last check-in: {new Date(patient.lastCheckIn).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['vital', 'activity', 'medication', 'symptom'].map((type) => {
            const stats = getStatsForType(type);
            return (
              <Card key={type} className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm capitalize">{type} Records</CardTitle>
                  {getHistoryIcon(type)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.latest ? `Latest: ${formatDate(stats.latest)}` : 'No records'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        {showCharts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Charts */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📈 Health Trends</CardTitle>
                <CardDescription>Track vital signs over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      {(metricFilter === 'all' || metricFilter === 'bloodPressure') && (
                        <Line
                          type="monotone"
                          dataKey="bloodPressure"
                          stroke="var(--color-bloodPressure)"
                          strokeWidth={2}
                          name="Blood Pressure (Systolic)"
                        />
                      )}
                      {(metricFilter === 'all' || metricFilter === 'heartRate') && (
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          stroke="var(--color-heartRate)"
                          strokeWidth={2}
                          name="Heart Rate"
                        />
                      )}
                      {(metricFilter === 'all' || metricFilter === 'oxygen') && (
                        <Line
                          type="monotone"
                          dataKey="oxygen"
                          stroke="var(--color-oxygen)"
                          strokeWidth={2}
                          name="Oxygen %"
                        />
                      )}
                      {(metricFilter === 'all' || metricFilter === 'temperature') && (
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="var(--color-temperature)"
                          strokeWidth={2}
                          name="Temperature °F"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">👣 Daily Activity</CardTitle>
                <CardDescription>Steps taken over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" fill="var(--color-steps)" name="Steps" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Metric Distribution */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📊 Vital Signs Distribution</CardTitle>
                <CardDescription>Breakdown of recorded metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metricDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {metricDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📈 Summary Statistics</CardTitle>
                <CardDescription>Key health metrics overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {Math.round(chartData.reduce((sum, d) => sum + (d.bloodPressure || 0), 0) / chartData.filter(d => d.bloodPressure).length) || 'N/A'}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg BP (Sys)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {Math.round(chartData.reduce((sum, d) => sum + (d.heartRate || 0), 0) / chartData.filter(d => d.heartRate).length) || 'N/A'}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {Math.round(chartData.reduce((sum, d) => sum + (d.oxygen || 0), 0) / chartData.filter(d => d.oxygen).length) || 'N/A'}%
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Oxygen</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {Math.round(chartData.reduce((sum, d) => sum + (d.steps || 0), 0) / chartData.filter(d => d.steps).length) || 'N/A'}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Steps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Filter History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({history.length})</TabsTrigger>
                <TabsTrigger value="vital">
                  Vitals ({history.filter(h => h.type === 'vital').length})
                </TabsTrigger>
                <TabsTrigger value="activity">
                  Activity ({history.filter(h => h.type === 'activity').length})
                </TabsTrigger>
                <TabsTrigger value="medication">
                  Medication ({history.filter(h => h.type === 'medication').length})
                </TabsTrigger>
                <TabsTrigger value="symptom">
                  Symptoms ({history.filter(h => h.type === 'symptom').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* History Timeline */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">📅 Health Timeline</CardTitle>
            <CardDescription>
              {history.length} health event{history.length !== 1 ? 's' : ''} in the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getHistoryIcon(event.type)}
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-600 mt-2"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold dark:text-white">{event.title}</h4>
                        <Badge className={getHistoryTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        {getTrendIcon(event.type, event.value)}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{formatDate(event.date)}</div>
                        <div>{formatTime(event.date)}</div>
                      </div>
                    </div>

                    {event.value && (
                      <div className="mb-2">
                        <span className="font-medium dark:text-white">Value: </span>
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {event.value}
                        </span>
                      </div>
                    )}

                    {event.notes && (
                      <p className="text-muted-foreground">{event.notes}</p>
                    )}
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No health events found for the selected filters</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilter('all')}
                  >
                    Show All Events
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">⚡ Export & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                📊 Generate Report
              </Button>
              <Button variant="outline">
                📧 Share with Doctor
              </Button>
              <Button variant="outline">
                🔄 Sync Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}