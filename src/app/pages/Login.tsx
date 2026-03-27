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

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(name, email, password, role);
      if (success) {
        toast.success('✓ Login successful!');
        
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
        toast.error('❌ Invalid credentials');
      }
    } catch (error) {
      toast.error('❌ Login failed. Please try again.');
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
          <CardTitle className="text-2xl">💙 Elder Health Monitor</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/register')}
              >
                Don't have an account? Register
              </Button>
            </div>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold mb-2">Demo Access:</p>
            <p className="text-xs text-blue-700">
              Use any email and password combination to access the system. Select your role above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}