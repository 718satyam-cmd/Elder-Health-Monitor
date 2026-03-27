import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { Alert as AlertType, mockAlerts } from '../utils/mockData';
import { toast } from 'sonner';

interface AlertsPanelProps {
  canAcknowledge?: boolean;
}

export function AlertsPanel({ canAcknowledge = false }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === 'critical' ? 'destructive' : 'default';
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('✓ Alert acknowledged');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🔔 Alerts & Notifications</CardTitle>
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive">{unacknowledgedAlerts.length} New</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            ✅ No alerts at this time
          </p>
        ) : (
          alerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)} className={alert.acknowledged ? 'opacity-50' : ''}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="text-sm mb-1">
                      {alert.type === 'critical' ? '🚨 Critical Alert' : alert.type === 'warning' ? '⚠️ Warning' : 'ℹ️ Information'}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {alert.message}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                </div>
                {canAcknowledge && !alert.acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcknowledge(alert.id)}
                    className="shrink-0"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Acknowledge
                  </Button>
                )}
                {alert.acknowledged && (
                  <Badge variant="secondary" className="shrink-0">
                    <Check className="h-3 w-3 mr-1" />
                    Acknowledged
                  </Badge>
                )}
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
}