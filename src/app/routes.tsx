import { createBrowserRouter, Navigate } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import CareManagerDashboard from './pages/CareManagerDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ChildDashboard from './pages/ChildDashboard';
import Profile from './pages/Profile';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import PatientDetails from './pages/PatientDetails';
import History from './pages/History';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/care-manager',
    element: <CareManagerDashboard />,
  },
  {
    path: '/parent',
    element: <ParentDashboard />,
  },
  {
    path: '/child',
    element: <ChildDashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/medical-records/:patientId?',
    element: <MedicalRecords />,
  },
  {
    path: '/appointments/:patientId?',
    element: <Appointments />,
  },
  {
    path: '/medications/:patientId?',
    element: <Medications />,
  },
  {
    path: '/patient-details/:patientId',
    element: <PatientDetails />,
  },
  {
    path: '/history/:patientId?',
    element: <History />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <a href="/login" className="text-blue-600 hover:underline">
            Return to Login
          </a>
        </div>
      </div>
    ),
  },
]);