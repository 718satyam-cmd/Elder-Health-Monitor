import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Calendar, Stethoscope, TestTube, Pill, Scissors, ArrowLeft } from 'lucide-react';
import { mockMedicalRecords, mockElders, mockAppointments } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

export default function MedicalRecords() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patientId } = useParams();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Filter records based on user role and patient ID
  const getFilteredRecords = () => {
    if (user?.role === 'care-manager') {
      return patientId
        ? mockMedicalRecords.filter(record => record.patientId === patientId)
        : mockMedicalRecords;
    } else {
      // For parents/family members, show only their own records
      return mockMedicalRecords.filter(record => record.patientId === '1'); // Assuming current user is patient 1
    }
  };

  const records = getFilteredRecords();
  const patient = patientId ? mockElders.find(e => e.id === patientId) : null;

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Stethoscope className="h-4 w-4" />;
      case 'emergency': return <Scissors className="h-4 w-4" />;
      case 'lab': return <TestTube className="h-4 w-4" />;
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'surgery': return <Scissors className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'lab': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'prescription': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'surgery': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddNewRecord = () => {
    toast.info('Add New Record functionality - would open a modal or form to add a new medical record');
    // In a real app, this would open a modal or navigate to an add record page
  };

  const handleScheduleAppointment = () => {
    setIsAppointmentModalOpen(true);
  };

  const handleAppointmentScheduled = (appointmentData: { date: Date; time: string; type: string; doctor: string; facility: string; notes?: string; patientId: string }) => {
    // In a real app, this would make an API call
    const newAppointment = {
      id: Date.now().toString(),
      date: appointmentData.date.toISOString().split('T')[0],
      time: appointmentData.time,
      type: appointmentData.type as 'checkup' | 'consultation' | 'follow-up' | 'emergency',
      doctor: appointmentData.doctor,
      facility: appointmentData.facility,
      status: 'scheduled' as const,
      notes: appointmentData.notes,
      patientId: appointmentData.patientId,
    };

    // Add to mock data (in a real app, this would be handled by the backend)
    mockAppointments.push(newAppointment);
    toast.success('Appointment scheduled successfully!');
    setIsAppointmentModalOpen(false);
  };

  const handleExportRecords = () => {
    const csvContent = [
      ['Date', 'Type', 'Title', 'Doctor', 'Notes'],
      ...records.map(record => [
        new Date(record.date).toLocaleDateString(),
        record.type,
        record.title,
        record.doctor,
        record.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Medical records exported successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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
              📋 Medical Records
            </h1>
            <p className="text-muted-foreground">
              {patient ? `Records for ${patient.name}` : 'View and manage medical records'}
            </p>
          </div>
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

        {/* Records List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Records Overview */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">📄 Recent Records</CardTitle>
              <CardDescription>
                {records.length} medical record{records.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedRecord === record.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedRecord(record.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getRecordIcon(record.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold dark:text-white">{record.title}</h4>
                          <p className="text-sm text-muted-foreground">{record.doctor}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(record.date)}</p>
                        </div>
                      </div>
                      <Badge className={getRecordTypeColor(record.type)}>
                        {record.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Record Details */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">📋 Record Details</CardTitle>
              <CardDescription>
                {selectedRecord ? 'Detailed information' : 'Select a record to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRecord ? (
                (() => {
                  const record = records.find(r => r.id === selectedRecord);
                  if (!record) return <p>Record not found</p>;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {getRecordIcon(record.type)}
                        <div>
                          <h3 className="text-lg font-semibold dark:text-white">{record.title}</h3>
                          <Badge className={getRecordTypeColor(record.type)}>
                            {record.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium dark:text-white">Date</p>
                          <p className="text-muted-foreground">{formatDate(record.date)}</p>
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">Doctor</p>
                          <p className="text-muted-foreground">{record.doctor}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="font-medium dark:text-white">Facility</p>
                          <p className="text-muted-foreground">{record.facility}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium dark:text-white mb-2">Description</p>
                        <p className="text-muted-foreground">{record.description}</p>
                      </div>

                      {record.notes && (
                        <div>
                          <p className="font-medium dark:text-white mb-2">Notes</p>
                          <p className="text-muted-foreground">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a medical record to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleAddNewRecord}>
                <FileText className="h-4 w-4 mr-2" />
                Add New Record
              </Button>
              <Button variant="outline" onClick={handleScheduleAppointment}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" onClick={handleExportRecords}>
                📊 Export Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ScheduleAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSchedule={handleAppointmentScheduled}
        patientId={patientId || '1'}
        patientName={patient?.name || 'Patient'}
      />
    </Layout>
  );
}