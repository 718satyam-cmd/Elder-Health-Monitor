import { useParams, useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { HealthMetrics } from '../components/HealthMetrics';
import { AlertsPanel } from '../components/AlertsPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Activity, Heart, Thermometer, Droplets, Footprints, User, FileText, Pill, Clock } from 'lucide-react';
import { mockElders, mockMedicalRecords, mockAppointments, mockMedications, mockHealthHistory } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function PatientDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patientId } = useParams();

  // Redirect if not a care manager
  if (user?.role !== 'care-manager') {
    navigate('/parent');
    return null;
  }

  const patient = mockElders.find(e => e.id === patientId || '1'); // Default to first patient if not found
  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <Button onClick={() => navigate('/care-manager')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const patientRecords = mockMedicalRecords.filter(r => r.patientId === patient.id);
  const patientAppointments = mockAppointments.filter(a => a.patientId === patient.id);
  const patientMedications = mockMedications.filter(m => m.patientId === patient.id);
  const patientHistory = mockHealthHistory.filter(h => h.patientId === patient.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'call':
        toast.success('📞 Calling patient...');
        break;
      case 'message':
        toast.success('💬 Opening messaging...');
        break;
      case 'emergency':
        toast.error('🚨 Emergency contact initiated');
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/care-manager')}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">
              👤 Patient Details
            </h1>
            <p className="text-muted-foreground">
              Comprehensive view of {patient.name}'s health and care information
            </p>
          </div>
        </div>

        {/* Patient Overview */}
        <Card className="dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {patient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold dark:text-white">{patient.name}</h2>
                  <p className="text-muted-foreground">Age: {patient.age} • ID: {patient.id}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Last check-in: {getTimeAgo(patient.lastCheckIn)}
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active Monitoring
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleQuickAction('call')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" onClick={() => handleQuickAction('message')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="destructive" onClick={() => handleQuickAction('emergency')}>
                  🚨 Emergency
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72 bpm</div>
              <p className="text-xs text-green-600">Normal range</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128/82</div>
              <p className="text-xs text-yellow-600">Slightly elevated</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Oxygen Level</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-green-600">Good</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Daily Steps</CardTitle>
              <Footprints className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6,847</div>
              <p className="text-xs text-green-600">Goal: 7,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="records">📄 Medical Records</TabsTrigger>
            <TabsTrigger value="appointments">📅 Appointments</TabsTrigger>
            <TabsTrigger value="medications">💊 Medications</TabsTrigger>
            <TabsTrigger value="history">📈 Health History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Metrics */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">📊 Health Metrics</CardTitle>
                  <CardDescription>Current vital signs and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthMetrics />
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">🔔 Recent Alerts</CardTitle>
                  <CardDescription>Latest notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsPanel canAcknowledge={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📄 Medical Records</CardTitle>
                <CardDescription>{patientRecords.length} records found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold dark:text-white">{record.title}</h4>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {record.doctor} • {record.facility} • {formatDate(record.date)}
                      </p>
                      <p className="text-sm">{record.description}</p>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Notes: {record.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => navigate(`/medical-records/${patient.id}`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View All Records
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📅 Appointments</CardTitle>
                <CardDescription>{patientAppointments.length} appointments scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold dark:text-white">{appointment.type} Appointment</h4>
                        <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {appointment.doctor} • {appointment.facility}
                      </p>
                      <p className="text-sm">
                        {formatDate(appointment.date)} at {appointment.time}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => navigate(`/appointments/${patient.id}`)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Appointments
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="mt-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">💊 Current Medications</CardTitle>
                <CardDescription>{patientMedications.filter(m => m.status === 'active').length} active medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientMedications.map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold dark:text-white">{medication.name} ({medication.dosage})</h4>
                        <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}>
                          {medication.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {medication.frequency} • Prescribed by {medication.prescribedBy}
                      </p>
                      <p className="text-sm">Started: {formatDate(medication.startDate)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {medication.instructions}
                      </p>
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => navigate(`/medications/${patient.id}`)}>
                  <Pill className="h-4 w-4 mr-2" />
                  Manage Medications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📈 Health History</CardTitle>
                <CardDescription>{patientHistory.length} recent health events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientHistory.slice(0, 10).map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold dark:text-white">{event.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <Badge variant="outline" className="mb-2">{event.type}</Badge>
                      {event.value && (
                        <p className="text-sm font-medium mb-1">Value: {event.value}</p>
                      )}
                      {event.notes && (
                        <p className="text-sm text-muted-foreground">{event.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => navigate(`/history/${patient.id}`)}>
                  <Activity className="h-4 w-4 mr-2" />
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}