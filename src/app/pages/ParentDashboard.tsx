import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { HealthMetrics } from '../components/HealthMetrics';
import { AlertsPanel } from '../components/AlertsPanel';
import { EmergencyButton } from '../components/EmergencyButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Activity, Heart, UserCheck, Phone, FileText, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">💙 My Health Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name}! Monitor your health metrics and access emergency services
            </p>
          </div>
          <EmergencyButton />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">💚 Health Status</CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground">All vitals normal</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">🚶 Activity Level</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,234</div>
              <p className="text-xs text-muted-foreground">Steps today</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">👨‍⚕️ Care Team</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Members monitoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Care Team */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">👥 Your Care Team</CardTitle>
            <CardDescription>Family members and care managers monitoring your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Dr. Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Primary Care Manager</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">Active</Badge>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-500 text-white">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Jennifer Davis</p>
                    <p className="text-sm text-muted-foreground">Daughter - Family Member</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Family</Badge>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-orange-500 text-white">MD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Michael Davis</p>
                    <p className="text-sm text-muted-foreground">Son - Family Member</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Family</Badge>
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => navigate('/medical-records')}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">Medical Records</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Appointments</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => navigate('/medications')}
              >
                <Heart className="h-6 w-6" />
                <span className="text-sm">Medications</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={() => navigate('/history')}
              >
                <Activity className="h-6 w-6" />
                <span className="text-sm">Health History</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health">📊 My Health Data</TabsTrigger>
            <TabsTrigger value="alerts">🔔 Notifications</TabsTrigger>
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