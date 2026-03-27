import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner';

export function EmergencyButton() {
  const handleEmergency = () => {
    toast.error('🚨 Emergency Alert Sent!', {
      description: '📞 Emergency services and care team have been notified.',
      duration: 5000,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" className="gap-2 animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          🚨 Emergency
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            🚨 Activate Emergency Protocol
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <div className="mb-2">This will immediately notify:</div>
              <ul className="mt-2 ml-4 list-disc">
                <li>🚑 Emergency services (911)</li>
                <li>👨‍⚕️ Primary care manager</li>
                <li>👨‍👩‍👧 All family members</li>
                <li>📞 Designated emergency contacts</li>
              </ul>
              <div className="mt-4 font-semibold">⚠️ Only use in case of genuine emergency.</div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEmergency}
            className="bg-red-600 hover:bg-red-700"
          >
            ✓ Confirm Emergency
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}