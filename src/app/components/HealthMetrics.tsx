import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, Heart, Droplets, Wind, Thermometer, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { generateHealthData } from '../utils/mockData';

export function HealthMetrics() {
  const healthData = generateHealthData();
  const latestReading = healthData[healthData.length - 1];

  const getStatus = (metric: string, value: number) => {
    const ranges: Record<string, { normal: [number, number]; label: string }> = {
      heartRate: { normal: [60, 100], label: 'Normal' },
      oxygenLevel: { normal: [95, 100], label: 'Normal' },
      temperature: { normal: [36, 37.5], label: 'Normal' },
      bloodPressure: { normal: [90, 140], label: 'Normal' },
    };

    const range = ranges[metric];
    if (!range) return { variant: 'default' as const, label: 'Normal' };

    if (value >= range.normal[0] && value <= range.normal[1]) {
      return { variant: 'default' as const, label: range.label };
    }
    return { variant: 'destructive' as const, label: 'Alert' };
  };

  const metrics = [
    {
      icon: Heart,
      title: '❤️ Heart Rate',
      value: `${latestReading.heartRate} bpm`,
      status: getStatus('heartRate', latestReading.heartRate),
      color: 'text-red-500',
    },
    {
      icon: Droplets,
      title: '🩸 Blood Pressure',
      value: `${latestReading.bloodPressureSystolic}/${latestReading.bloodPressureDiastolic}`,
      status: getStatus('bloodPressure', latestReading.bloodPressureSystolic),
      color: 'text-blue-500',
    },
    {
      icon: Wind,
      title: '💨 Oxygen Level',
      value: `${latestReading.oxygenLevel}%`,
      status: getStatus('oxygenLevel', latestReading.oxygenLevel),
      color: 'text-cyan-500',
    },
    {
      icon: Thermometer,
      title: '🌡️ Temperature',
      value: `${latestReading.temperature.toFixed(1)}°C`,
      status: getStatus('temperature', latestReading.temperature),
      color: 'text-orange-500',
    },
    {
      icon: TrendingUp,
      title: '🚶 Daily Steps',
      value: latestReading.steps.toLocaleString(),
      status: { variant: 'default' as const, label: 'Active' },
      color: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <Badge variant={metric.status.variant} className="mt-2">
                    {metric.status.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Heart Rate Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData} id="heart-rate-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-hr" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} key="xaxis-hr" />
                <YAxis domain={[40, 120]} key="yaxis-hr" />
                <Tooltip key="tooltip-hr" />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" key="line-hr" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Blood Pressure Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Blood Pressure Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData} id="blood-pressure-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-bp" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} key="xaxis-bp" />
                <YAxis domain={[50, 160]} key="yaxis-bp" />
                <Tooltip key="tooltip-bp" />
                <Line type="monotone" dataKey="bloodPressureSystolic" stroke="#3b82f6" strokeWidth={2} name="Systolic" key="systolic" />
                <Line type="monotone" dataKey="bloodPressureDiastolic" stroke="#60a5fa" strokeWidth={2} name="Diastolic" key="diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Oxygen Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-cyan-500" />
              Oxygen Saturation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={healthData} id="oxygen-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-ox" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} key="xaxis-ox" />
                <YAxis domain={[90, 100]} key="yaxis-ox" />
                <Tooltip key="tooltip-ox" />
                <Area type="monotone" dataKey="oxygenLevel" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Oxygen Level" key="area-ox" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={healthData} id="activity-chart">
                <CartesianGrid strokeDasharray="3 3" key="grid-act" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} key="xaxis-act" />
                <YAxis key="yaxis-act" />
                <Tooltip key="tooltip-act" />
                <Bar dataKey="steps" fill="#22c55e" name="Steps" key="bar-act" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}