export interface HealthReading {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenLevel: number;
  temperature: number;
  steps: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Elder {
  id: string;
  name: string;
  age: number;
  photo: string;
  lastCheckIn: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'checkup' | 'emergency' | 'lab' | 'prescription' | 'surgery';
  title: string;
  description: string;
  doctor: string;
  facility: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  type: 'checkup' | 'consultation' | 'follow-up' | 'emergency';
  doctor: string;
  facility: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  status: 'active' | 'completed' | 'discontinued';
}

export interface HealthHistory {
  id: string;
  patientId: string;
  date: string;
  type: 'vital' | 'symptom' | 'activity' | 'medication';
  title: string;
  value?: string;
  notes?: string;
}

// Generate mock health data for the last 7 days
export function generateHealthData(): HealthReading[] {
  const data: HealthReading[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      timestamp: date.toISOString().split('T')[0],
      heartRate: 65 + Math.floor(Math.random() * 20),
      bloodPressureSystolic: 115 + Math.floor(Math.random() * 20),
      bloodPressureDiastolic: 70 + Math.floor(Math.random() * 15),
      oxygenLevel: 95 + Math.floor(Math.random() * 5),
      temperature: 36.5 + Math.random() * 1,
      steps: 2000 + Math.floor(Math.random() * 5000),
    });
  }

  return data;
}

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    message: 'Low oxygen level detected (92%) - Immediate attention required',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    acknowledged: false,
  },
  {
    id: '2',
    type: 'warning',
    message: 'Heart rate elevated above normal range (95 bpm)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    acknowledged: false,
  },
  {
    id: '3',
    type: 'info',
    message: 'Daily step goal achieved (7,500 steps)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    acknowledged: true,
  },
  {
    id: '4',
    type: 'warning',
    message: 'Medication reminder: Blood pressure medication due at 8:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    acknowledged: true,
  },
];

export const mockElders: Elder[] = [
  {
    id: '1',
    name: 'Margaret Thompson',
    age: 72,
    photo: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=200&h=200&fit=crop',
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    name: 'Robert Martinez',
    age: 68,
    photo: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop',
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    name: 'Patricia Johnson',
    age: 75,
    photo: 'https://images.unsplash.com/photo-1542838686-5e5e5c34c1bc?w=200&h=200&fit=crop',
    lastCheckIn: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-03-15',
    type: 'checkup',
    title: 'Annual Physical Examination',
    description: 'Comprehensive health assessment including cardiovascular, respiratory, and musculoskeletal evaluation.',
    doctor: 'Dr. Sarah Chen',
    facility: 'City General Hospital',
    notes: 'Patient reports occasional dizziness. Recommended follow-up in 3 months.',
  },
  {
    id: '2',
    patientId: '1',
    date: '2024-02-20',
    type: 'lab',
    title: 'Blood Work Results',
    description: 'Complete blood count and metabolic panel',
    doctor: 'Dr. Michael Rodriguez',
    facility: 'City Lab Services',
    notes: 'Cholesterol levels slightly elevated. Started low-dose statin therapy.',
  },
  {
    id: '3',
    patientId: '2',
    date: '2024-03-10',
    type: 'emergency',
    title: 'Chest Pain Evaluation',
    description: 'Emergency room visit for acute chest pain',
    doctor: 'Dr. Emily Watson',
    facility: 'Emergency Department - City General',
    notes: 'ECG normal, stress test recommended. Pain likely musculoskeletal.',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-03-25',
    time: '10:00 AM',
    type: 'follow-up',
    doctor: 'Dr. Sarah Chen',
    facility: 'City General Hospital',
    status: 'scheduled',
    notes: 'Follow-up on blood pressure medication adjustment',
  },
  {
    id: '2',
    patientId: '1',
    date: '2024-04-01',
    time: '2:30 PM',
    type: 'consultation',
    doctor: 'Dr. Lisa Park',
    facility: 'Cardiology Associates',
    status: 'scheduled',
    notes: 'Cardiology consultation for heart rhythm monitoring',
  },
  {
    id: '3',
    patientId: '2',
    date: '2024-03-22',
    time: '9:00 AM',
    type: 'checkup',
    doctor: 'Dr. Michael Rodriguez',
    facility: 'Family Medicine Clinic',
    status: 'scheduled',
  },
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    patientId: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2024-02-15',
    prescribedBy: 'Dr. Sarah Chen',
    instructions: 'Take with food in the morning',
    status: 'active',
  },
  {
    id: '2',
    patientId: '1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2024-01-10',
    prescribedBy: 'Dr. Michael Rodriguez',
    instructions: 'Take with meals',
    status: 'active',
  },
  {
    id: '3',
    patientId: '2',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    startDate: '2024-03-01',
    prescribedBy: 'Dr. Emily Watson',
    instructions: 'Take with food',
    status: 'active',
  },
];

export const mockHealthHistory: HealthHistory[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-03-20T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '128/82 mmHg',
    notes: 'Slightly elevated, continue monitoring',
  },
  {
    id: '2',
    patientId: '1',
    date: '2024-03-20T08:00:00Z',
    type: 'medication',
    title: 'Lisinopril Taken',
    value: '10mg',
    notes: 'Morning dose administered',
  },
  {
    id: '3',
    patientId: '1',
    date: '2024-03-19T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '6,847 steps',
    notes: 'Good activity level for the day',
  },
  {
    id: '4',
    patientId: '1',
    date: '2024-03-19T14:30:00Z',
    type: 'vital',
    title: 'Heart Rate',
    value: '72 bpm',
    notes: 'Normal resting heart rate',
  },
  {
    id: '5',
    patientId: '1',
    date: '2024-03-19T14:25:00Z',
    type: 'vital',
    title: 'Blood Oxygen',
    value: '98%',
    notes: 'Excellent oxygen saturation',
  },
  {
    id: '6',
    patientId: '1',
    date: '2024-03-19T14:20:00Z',
    type: 'vital',
    title: 'Temperature',
    value: '98.6°F',
    notes: 'Normal body temperature',
  },
  {
    id: '7',
    patientId: '1',
    date: '2024-03-18T08:00:00Z',
    type: 'medication',
    title: 'Metformin Taken',
    value: '500mg',
    notes: 'Morning dose administered',
  },
  {
    id: '8',
    patientId: '1',
    date: '2024-03-18T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '5,234 steps',
    notes: 'Below average, encourage more activity',
  },
  {
    id: '9',
    patientId: '1',
    date: '2024-03-18T14:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '122/78 mmHg',
    notes: 'Within normal range',
  },
  {
    id: '10',
    patientId: '1',
    date: '2024-03-17T10:00:00Z',
    type: 'symptom',
    title: 'Mild Headache',
    notes: 'Reported mild headache, resolved with rest and hydration',
  },
  {
    id: '11',
    patientId: '2',
    date: '2024-03-20T09:00:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '135/85 mmHg',
    notes: 'Monitor closely',
  },
  {
    id: '12',
    patientId: '2',
    date: '2024-03-20T08:30:00Z',
    type: 'medication',
    title: 'Aspirin Taken',
    value: '81mg',
    notes: 'Morning dose administered',
  },
  {
    id: '13',
    patientId: '2',
    date: '2024-03-19T19:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '4,567 steps',
    notes: 'Moderate activity level',
  },
  {
    id: '14',
    patientId: '2',
    date: '2024-03-19T15:00:00Z',
    type: 'symptom',
    title: 'Chest Discomfort',
    notes: 'Mild chest pain reported, resolved after rest',
  },
  {
    id: '15',
    patientId: '1',
    date: '2024-03-16T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '125/80 mmHg',
    notes: 'Stable readings',
  },
  {
    id: '16',
    patientId: '1',
    date: '2024-03-16T14:30:00Z',
    type: 'vital',
    title: 'Heart Rate',
    value: '68 bpm',
    notes: 'Good resting heart rate',
  },
  {
    id: '17',
    patientId: '1',
    date: '2024-03-15T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '7,123 steps',
    notes: 'Excellent activity level',
  },
  {
    id: '18',
    patientId: '1',
    date: '2024-03-15T08:00:00Z',
    type: 'medication',
    title: 'Lisinopril Taken',
    value: '10mg',
    notes: 'Morning dose administered',
  },
  {
    id: '19',
    patientId: '1',
    date: '2024-03-14T14:30:00Z',
    type: 'vital',
    title: 'Blood Oxygen',
    value: '97%',
    notes: 'Good oxygen saturation',
  },
  {
    id: '20',
    patientId: '1',
    date: '2024-03-14T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '120/75 mmHg',
    notes: 'Excellent blood pressure',
  },
  {
    id: '21',
    patientId: '1',
    date: '2024-03-13T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '118/74 mmHg',
    notes: 'Consistently good readings',
  },
  {
    id: '22',
    patientId: '1',
    date: '2024-03-13T14:30:00Z',
    type: 'vital',
    title: 'Heart Rate',
    value: '70 bpm',
    notes: 'Normal resting heart rate',
  },
  {
    id: '23',
    patientId: '1',
    date: '2024-03-13T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '8,456 steps',
    notes: 'Very active day, exceeded daily goal',
  },
  {
    id: '24',
    patientId: '1',
    date: '2024-03-12T08:00:00Z',
    type: 'medication',
    title: 'Metformin Taken',
    value: '500mg',
    notes: 'Morning dose administered',
  },
  {
    id: '25',
    patientId: '1',
    date: '2024-03-12T14:30:00Z',
    type: 'vital',
    title: 'Blood Oxygen',
    value: '99%',
    notes: 'Excellent oxygen saturation',
  },
  {
    id: '26',
    patientId: '1',
    date: '2024-03-12T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '6,789 steps',
    notes: 'Good activity level',
  },
  {
    id: '27',
    patientId: '1',
    date: '2024-03-11T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '124/79 mmHg',
    notes: 'Slightly elevated, monitor closely',
  },
  {
    id: '28',
    patientId: '1',
    date: '2024-03-11T14:30:00Z',
    type: 'vital',
    title: 'Temperature',
    value: '98.4°F',
    notes: 'Slightly elevated temperature',
  },
  {
    id: '29',
    patientId: '1',
    date: '2024-03-11T16:00:00Z',
    type: 'symptom',
    title: 'Fatigue',
    notes: 'Reported feeling tired, recommended rest and hydration',
  },
  {
    id: '30',
    patientId: '1',
    date: '2024-03-10T08:00:00Z',
    type: 'medication',
    title: 'Lisinopril Taken',
    value: '10mg',
    notes: 'Morning dose administered',
  },
  {
    id: '31',
    patientId: '1',
    date: '2024-03-10T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '4,321 steps',
    notes: 'Lower activity day, encourage more movement',
  },
  {
    id: '32',
    patientId: '1',
    date: '2024-03-09T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '126/81 mmHg',
    notes: 'Monitor blood pressure trend',
  },
  {
    id: '33',
    patientId: '1',
    date: '2024-03-09T14:30:00Z',
    type: 'vital',
    title: 'Heart Rate',
    value: '75 bpm',
    notes: 'Slightly elevated heart rate',
  },
  {
    id: '34',
    patientId: '1',
    date: '2024-03-08T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '122/77 mmHg',
    notes: 'Within acceptable range',
  },
  {
    id: '35',
    patientId: '1',
    date: '2024-03-08T14:30:00Z',
    type: 'vital',
    title: 'Blood Oxygen',
    value: '96%',
    notes: 'Good oxygen saturation',
  },
  {
    id: '36',
    patientId: '1',
    date: '2024-03-08T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '5,678 steps',
    notes: 'Moderate activity level',
  },
  {
    id: '37',
    patientId: '1',
    date: '2024-03-07T08:00:00Z',
    type: 'medication',
    title: 'Metformin Taken',
    value: '500mg',
    notes: 'Morning dose administered',
  },
  {
    id: '38',
    patientId: '1',
    date: '2024-03-07T14:30:00Z',
    type: 'vital',
    title: 'Temperature',
    value: '98.2°F',
    notes: 'Normal body temperature',
  },
  {
    id: '39',
    patientId: '1',
    date: '2024-03-07T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '7,890 steps',
    notes: 'Excellent activity level, goal achieved',
  },
  {
    id: '40',
    patientId: '1',
    date: '2024-03-06T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '119/73 mmHg',
    notes: 'Excellent blood pressure reading',
  },
  {
    id: '41',
    patientId: '1',
    date: '2024-03-06T14:30:00Z',
    type: 'vital',
    title: 'Heart Rate',
    value: '69 bpm',
    notes: 'Optimal resting heart rate',
  },
  {
    id: '42',
    patientId: '1',
    date: '2024-03-05T08:00:00Z',
    type: 'medication',
    title: 'Lisinopril Taken',
    value: '10mg',
    notes: 'Morning dose administered',
  },
  {
    id: '43',
    patientId: '1',
    date: '2024-03-05T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '6,543 steps',
    notes: 'Good daily activity',
  },
  {
    id: '44',
    patientId: '1',
    date: '2024-03-04T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '121/76 mmHg',
    notes: 'Stable and within normal range',
  },
  {
    id: '45',
    patientId: '1',
    date: '2024-03-04T14:30:00Z',
    type: 'vital',
    title: 'Blood Oxygen',
    value: '98%',
    notes: 'Excellent oxygen saturation',
  },
  {
    id: '46',
    patientId: '1',
    date: '2024-03-03T08:00:00Z',
    type: 'medication',
    title: 'Metformin Taken',
    value: '500mg',
    notes: 'Morning dose administered',
  },
  {
    id: '47',
    patientId: '1',
    date: '2024-03-03T20:00:00Z',
    type: 'activity',
    title: 'Daily Steps',
    value: '8,901 steps',
    notes: 'Very active day, significantly exceeded goal',
  },
  {
    id: '48',
    patientId: '1',
    date: '2024-03-02T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '123/78 mmHg',
    notes: 'Good blood pressure control',
  },
  {
    id: '49',
    patientId: '1',
    date: '2024-03-02T14:30:00Z',
    type: 'vital',
    title: 'Temperature',
    value: '98.8°F',
    notes: 'Slightly elevated, monitor for fever',
  },
  {
    id: '50',
    patientId: '1',
    date: '2024-03-01T08:00:00Z',
    type: 'medication',
    title: 'Lisinopril Taken',
    value: '10mg',
    notes: 'Morning dose administered',
  },
  // Additional data for patient 2
  {
    id: '51',
    patientId: '2',
    date: '2024-03-20T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '132/84 mmHg',
    notes: 'Requires monitoring',
  },
  {
    id: '52',
    patientId: '2',
    date: '2024-03-19T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '130/82 mmHg',
    notes: 'Stable readings',
  },
  {
    id: '53',
    patientId: '2',
    date: '2024-03-18T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '128/80 mmHg',
    notes: 'Improving trend',
  },
  {
    id: '54',
    patientId: '2',
    date: '2024-03-17T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '135/85 mmHg',
    notes: 'Slight increase, continue monitoring',
  },
  {
    id: '55',
    patientId: '2',
    date: '2024-03-16T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '133/83 mmHg',
    notes: 'Within acceptable range',
  },
  {
    id: '56',
    patientId: '2',
    date: '2024-03-15T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '131/81 mmHg',
    notes: 'Good control maintained',
  },
  {
    id: '57',
    patientId: '2',
    date: '2024-03-14T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '129/79 mmHg',
    notes: 'Excellent readings',
  },
  {
    id: '58',
    patientId: '2',
    date: '2024-03-13T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '127/77 mmHg',
    notes: 'Optimal blood pressure',
  },
  {
    id: '59',
    patientId: '2',
    date: '2024-03-12T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '130/80 mmHg',
    notes: 'Stable and good',
  },
  {
    id: '60',
    patientId: '2',
    date: '2024-03-11T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '132/82 mmHg',
    notes: 'Monitor closely',
  },
  // Additional data for patient 3
  {
    id: '61',
    patientId: '3',
    date: '2024-03-20T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '125/75 mmHg',
    notes: 'Excellent blood pressure for age',
  },
  {
    id: '62',
    patientId: '3',
    date: '2024-03-19T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '123/73 mmHg',
    notes: 'Consistently good readings',
  },
  {
    id: '63',
    patientId: '3',
    date: '2024-03-18T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '126/76 mmHg',
    notes: 'Within normal range',
  },
  {
    id: '64',
    patientId: '3',
    date: '2024-03-17T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '124/74 mmHg',
    notes: 'Stable and healthy',
  },
  {
    id: '65',
    patientId: '3',
    date: '2024-03-16T08:30:00Z',
    type: 'vital',
    title: 'Blood Pressure Reading',
    value: '122/72 mmHg',
    notes: 'Optimal readings',
  },
];
