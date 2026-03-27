import { Layout } from '../components/Layout';
import { HealthMetrics } from '../components/HealthMetrics';
import { AlertsPanel } from '../components/AlertsPanel';
import { EmergencyButton } from '../components/EmergencyButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Eye, Phone, Shield, Clock } from 'lucide-react';
import { mockElders } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function ChildDashboard() {
  const { user } = useAuth();
  const parent = mockElders[0]; // Simulating the parent being monitored

  const formatLastCheckIn = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    return date.toLocaleTimeString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">👨‍👩‍👧 Family Member Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name}! Monitor your parent's health status (read-only access)
            </p>
          </div>
          <EmergencyButton />
        </div>

        {/* Access Notice */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">👁️ Read-Only Access</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You can view health data and receive alerts, but cannot modify settings or acknowledge alerts. 
                  Contact the care manager for any changes needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Profile */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">👤 Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={parent.photo} alt={parent.name} />
                  <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{parent.name}</h3>
                  <p className="text-sm text-muted-foreground">Age: {parent.age} years</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" className="bg-green-600">
                      <div className="h-2 w-2 rounded-full bg-white mr-2"></div>
                      Online
                    </Badge>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last update: {formatLastCheckIn(parent.lastCheckIn)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">💚 Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Stable</div>
              <p className="text-xs text-muted-foreground mt-1">All vitals within normal range</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">🔔 Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <p className="text-xs text-muted-foreground mt-1">1 warning, 1 info</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">👨‍⚕️ Care Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dr. Chen</div>
              <p className="text-xs text-muted-foreground mt-1">Primary care manager</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Care Manager */}
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-purple-600 text-white">SC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-purple-900 dark:text-purple-100">👩‍⚕️ Dr. Sarah Chen</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Primary Care Manager</p>
                </div>
              </div>
              <Button variant="outline" className="border-purple-300 hover:bg-purple-100">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health">
              <Eye className="h-4 w-4 mr-2" />
              📊 View Health Data
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Eye className="h-4 w-4 mr-2" />
              🔔 View Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="health" className="mt-6">
            <HealthMetrics />
          </TabsContent>
          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel canAcknowledge={false} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}