import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { User, Mail, Shield, Edit } from 'lucide-react';

export default function Profile() {
  const { user, updateUserName } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleSave = () => {
    if (editedName.trim()) {
      updateUserName(editedName);
    }
    setIsEditing(false);
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'care-manager':
        return { label: '👨‍⚕️ Care Manager', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'parent':
        return { label: '👤 Parent', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case 'child':
        return { label: '👨‍👩‍👧 Family Member', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
      default:
        return { label: 'User', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleInfo = getRoleLabel();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">👤 Profile</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? '💾 Save' : <><Edit className="h-4 w-4 mr-2" />Edit</>}
              </Button>
            </div>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center py-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome, {user?.name}!
              </h1>
            </div>

            <Separator />

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 py-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-3xl">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold dark:text-white">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-center text-2xl font-bold max-w-xs"
                      placeholder="Enter your name"
                    />
                  ) : (
                    user?.name
                  )}
                </h2>
                <Badge className={`mt-2 ${roleInfo.color}`}>
                  {roleInfo.label}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg dark:text-white">Account Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Full Name</Label>
                    <p className="font-medium dark:text-white">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Email Address</Label>
                    <p className="font-medium dark:text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Role</Label>
                    <p className="font-medium dark:text-white">{roleInfo.label}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">User ID</Label>
                    <p className="font-medium font-mono text-sm dark:text-white">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Role Description */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {user?.role === 'care-manager' && '👨‍⚕️ Care Manager Privileges'}
                {user?.role === 'parent' && '👤 Parent Account'}
                {user?.role === 'child' && '👨‍👩‍👧 Family Member Access'}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {user?.role === 'care-manager' && 'Full access to manage multiple patients, acknowledge alerts, and configure system settings.'}
                {user?.role === 'parent' && 'View your personal health data, access emergency services, and manage your care team.'}
                {user?.role === 'child' && 'Read-only access to monitor your parent\'s health status and receive important alerts.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
