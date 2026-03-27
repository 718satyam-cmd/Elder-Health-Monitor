import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { HealthMetrics } from '../components/HealthMetrics';
import { AlertsPanel } from '../components/AlertsPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, Activity, Bell, Settings, Clock, TrendingUp } from 'lucide-react';
import { mockElders } from '../utils/mockData';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function CareManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleManageAlerts = () => {
    toast.success('✓ Alert settings updated');
  };

  const formatLastCheckIn = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold dark:text-white">👨‍⚕️ Care Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Monitor and manage all patients from a centralized view
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockElders.length}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Avg Health Score</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">🕐 Last Update</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m</div>
              <p className="text-xs text-muted-foreground">Real-time sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">👥 Patient Overview</CardTitle>
                <CardDescription>Manage all monitored individuals</CardDescription>
              </div>
              <Button variant="outline" onClick={handleManageAlerts}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockElders.map((elder) => (
                <div
                  key={elder.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={elder.photo} alt={elder.name} />
                      <AvatarFallback>{elder.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{elder.name}</h3>
                      <p className="text-sm text-muted-foreground">Age: {elder.age}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Last check-in: {formatLastCheckIn(elder.lastCheckIn)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="default">Active</Badge>
                    <Button size="sm" onClick={() => navigate(`/patient-details/${elder.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabbed View */}
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health">📊 Health Metrics</TabsTrigger>
            <TabsTrigger value="alerts">🔔 Alerts & Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="health" className="mt-6">
            <HealthMetrics />
          </TabsContent>
          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel canAcknowledge={true} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}