import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Clock, User, MapPin, Phone, CheckCircle, XCircle, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { mockAppointments, mockElders } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

export default function Appointments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patientId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filter, setFilter] = useState('all');

  // Filter appointments based on user role and patient ID
  const getFilteredAppointments = () => {
    let appointmentsData = appointments;

    if (user?.role === 'care-manager') {
      appointmentsData = patientId
        ? appointmentsData.filter(apt => apt.patientId === patientId)
        : appointmentsData;
    } else {
      // For parents/family members, show only their own appointments
      appointmentsData = appointmentsData.filter(apt => apt.patientId === '1');
    }

    if (filter !== 'all') {
      appointmentsData = appointmentsData.filter(apt => apt.status === filter);
    }

    return appointmentsData.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
  };

  const appointmentsData = getFilteredAppointments();
  const patient = patientId ? mockElders.find(e => e.id === patientId) : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'consultation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'follow-up': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (date: string, time: string) => {
    const appointmentDateTime = new Date(date + ' ' + time);
    return appointmentDateTime > new Date();
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    toast.success(`Appointment ${newStatus}`);
  };

  const handleScheduleAppointment = (appointmentData: { date: Date; time: string; type: string; doctor: string; facility: string; notes?: string; patientId: string }) => {
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
    mockAppointments.push(newAppointment);
    toast.success('Appointment scheduled successfully!');
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
                📅 Appointments
              </h1>
              <p className="text-muted-foreground">
                {patient ? `Appointments for ${patient.name}` : 'Manage and schedule appointments'}
              </p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule New
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

        {/* Filters */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Filter Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({appointmentsData.length})</TabsTrigger>
                <TabsTrigger value="scheduled">
                  Scheduled ({appointmentsData.filter(a => a.status === 'scheduled').length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({appointmentsData.filter(a => a.status === 'completed').length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({appointmentsData.filter(a => a.status === 'cancelled').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Overview */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">📋 Appointments</CardTitle>
              <CardDescription>
                {appointmentsData.length} appointment{appointmentsData.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentsData.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(appointment.status)}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <Badge className={getAppointmentTypeColor(appointment.type)}>
                          {appointment.type}
                        </Badge>
                      </div>
                      {isUpcoming(appointment.date, appointment.time) && appointment.status === 'scheduled' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(appointment.id, 'completed')}>
                            Complete
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(appointment.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium dark:text-white">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{appointment.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{appointment.facility}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar/Upcoming View */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">📅 Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentsData
                  .filter(apt => apt.status === 'scheduled' && isUpcoming(apt.date, apt.time))
                  .slice(0, 3)
                  .map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getAppointmentTypeColor(appointment.type)}>
                          {appointment.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {appointment.time}
                        </span>
                      </div>
                      <h4 className="font-semibold dark:text-white mb-1">
                        {formatDate(appointment.date)}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {appointment.doctor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.facility}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}

                {appointmentsData.filter(apt => apt.status === 'scheduled' && isUpcoming(apt.date, apt.time)).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming appointments</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleScheduleAppointment}
        patientId={patientId || '1'}
        patientName={patient?.name || 'Patient'}
      />
    </Layout>
  );
}