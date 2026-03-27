import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Pill, Clock, User, Calendar, CheckCircle, AlertTriangle, ArrowLeft, Plus, Bell } from 'lucide-react';
import { mockMedications, mockElders } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function Medications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patientId } = useParams();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'discontinued'>('all');

  // Filter medications based on user role and patient ID
  const getFilteredMedications = () => {
    let medications = mockMedications;

    if (user?.role === 'care-manager') {
      medications = patientId
        ? medications.filter(med => med.patientId === patientId)
        : medications;
    } else {
      // For parents/family members, show only their own medications
      medications = medications.filter(med => med.patientId === '1');
    }

    if (filter !== 'all') {
      medications = medications.filter(med => med.status === filter);
    }

    return medications;
  };

  const medications = getFilteredMedications();
  const patient = patientId ? mockElders.find(e => e.id === patientId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'discontinued': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'discontinued': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Pill className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysOnMedication = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAdherenceRate = (medication: any) => {
    // Mock adherence calculation - in real app this would come from actual data
    const days = calculateDaysOnMedication(medication.startDate, medication.endDate);
    return Math.min(95 - Math.floor(Math.random() * 20), 100); // Mock 80-95% adherence
  };

  const handleMedicationAction = (medicationId: string, action: string) => {
    toast.success(`Medication ${action}`);
  };

  const activeMedications = medications.filter(med => med.status === 'active');
  const upcomingRefills = activeMedications.filter(med => {
    // Mock logic for medications needing refill soon
    return Math.random() > 0.7;
  });

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
                💊
              </h1>
              <p className="text-muted-foreground">
                {patient ? `Medications for ${patient.name}` : 'Manage medication schedules and adherence'}
              </p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeMedications.length}</div>
              <p className="text-xs text-muted-foreground">Currently prescribed</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Avg Adherence</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-green-600">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Due for Refill</CardTitle>
              <Bell className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{upcomingRefills.length}</div>
              <p className="text-xs text-muted-foreground">Within 7 days</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Completed Courses</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Filter Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({medications.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Active ({medications.filter(m => m.status === 'active').length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({medications.filter(m => m.status === 'completed').length})
                </TabsTrigger>
                <TabsTrigger value="discontinued">
                  Discontinued ({medications.filter(m => m.status === 'discontinued').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Medications List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medications Overview */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">💊 Current Medications</CardTitle>
              <CardDescription>
                {medications.length} medication{medications.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(medication.status)}
                        <div>
                          <h4 className="font-semibold dark:text-white">{medication.name}</h4>
                          <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(medication.status)}>
                        {medication.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="font-medium dark:text-white">Frequency</p>
                        <p className="text-muted-foreground">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">Started</p>
                        <p className="text-muted-foreground">{formatDate(medication.startDate)}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium dark:text-white mb-1">Adherence</p>
                      <div className="flex items-center gap-2">
                        <Progress value={getAdherenceRate(medication)} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                          {getAdherenceRate(medication)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Prescribed by {medication.prescribedBy}
                      </div>
                      {medication.status === 'active' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleMedicationAction(medication.id, 'refilled')}>
                            Refill
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMedicationAction(medication.id, 'stopped')}>
                            Stop
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                      <strong>Instructions:</strong> {medication.instructions}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medication Schedule & Reminders */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">📅 Today's Schedule</CardTitle>
                <CardDescription>Medications due today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeMedications.slice(0, 3).map((medication, index) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Pill className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{medication.name}</p>
                          <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{['8:00 AM', '2:00 PM', '8:00 PM'][index]}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Mark Taken
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Refill Reminders */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">🔔 Refill Reminders</CardTitle>
                <CardDescription>Medications needing attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingRefills.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium dark:text-white">{medication.name}</p>
                          <p className="text-sm text-muted-foreground">Refill due soon</p>
                        </div>
                      </div>
                      <Button size="sm">
                        Request Refill
                      </Button>
                    </div>
                  ))}

                  {upcomingRefills.length === 0 && (
                    <div className="text-center py-6">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">All medications are up to date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}