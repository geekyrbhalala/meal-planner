import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, tokens, hydrateUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Try to restore session on mount
    if (tokens && !isAuthenticated) {
      hydrateUser();
    }
  }, [tokens, isAuthenticated, hydrateUser]);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(r => location.pathname.startsWith(r));

    if (!isAuthenticated && !tokens && !isPublicRoute) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }

    if (isAuthenticated && isPublicRoute) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, tokens, location.pathname, navigate]);

  return <>{children}</>;
}
