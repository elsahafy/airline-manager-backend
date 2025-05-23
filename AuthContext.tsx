import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, airlineName: string, hubCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          const { data } = await authAPI.getUser();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await authAPI.login({ email, password });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.user.id,
          email: data.user.email,
          airline: data.airline
        });
        alert('Login successful!');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, airlineName: string, hubCode: string) => {
    try {
      setLoading(true);
      await authAPI.register({
        email,
        password,
        airline_name: airlineName,
        hub_airport_code: hubCode
      });
      
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
      alert('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
