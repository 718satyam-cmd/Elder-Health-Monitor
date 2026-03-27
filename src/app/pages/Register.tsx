import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password, role);
      if (success) {
        toast.success('✓ Registration successful!');
        
        // Route based on role
        switch (role) {
          case 'care-manager':
            navigate('/care-manager');
            break;
          case 'parent':
            navigate('/parent');
            break;
          case 'child':
            navigate('/child');
            break;
        }
      } else {
        toast.error('❌ Registration failed');
      }
    } catch (error) {
      toast.error('❌ Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full p-3">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">✨ Create Account</CardTitle>
          <CardDescription>Join the Elder Health Monitor system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Register as</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="care-manager">👨‍⚕️ Care Manager</SelectItem>
                  <SelectItem value="parent">👤 Parent (Elder)</SelectItem>
                  <SelectItem value="child">👨‍👩‍👧 Family Member</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {role === 'care-manager' && '👨‍⚕️ Manage multiple patients and alerts'}
                {role === 'parent' && '👤 View your own health data and emergency access'}
                {role === 'child' && '👨‍👩‍👧 Monitor your parent\'s health (read-only)'}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}