import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  dealership?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, dealership?: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'microsoft' | 'apple') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  socialLoading: {
    google: boolean;
    microsoft: boolean;
    apple: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    microsoft: false,
    apple: false
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('sidecarai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Dealer',
        dealership: 'Premium Auto Group'
      };
      
      setUser(mockUser);
      localStorage.setItem('sidecarai_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, dealership?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        dealership
      };
      
      setUser(mockUser);
      localStorage.setItem('sidecarai_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    try {
      // Simulate API call - replace with actual social authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: '1',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        dealership: 'Social Login Auto Group'
      };
      
      setUser(mockUser);
      localStorage.setItem('sidecarai_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error(`${provider} authentication failed`);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call - replace with actual password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would send a reset email
    } catch (error) {
      throw new Error('Password reset failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sidecarai_user');
  };

  const value = {
    user,
    login,
    signup,
    socialLogin,
    resetPassword,
    logout,
    isLoading,
    socialLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
