import { Navigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isComplete } = useQuizStore();

  if (!isComplete) {
    return <Navigate to="/quiz" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
