import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'care-manager' | 'parent' | 'child';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      // Store the user's name for future logins
      localStorage.setItem('userName', name);
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    if (name && email && password) {
      // Store the user's name for future logins
      localStorage.setItem('userName', name);
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Keep the name stored for convenience, but you could clear it if needed
    // localStorage.removeItem('userName');
  };

  const updateUserName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      localStorage.setItem('userName', name);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}