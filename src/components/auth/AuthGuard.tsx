import { useAuth } from './AuthContext';
import { LoginForm } from './LoginForm';
import { LoadingView } from './LoadingView';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
};