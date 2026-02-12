import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === "professor") return <Navigate to="/professor/provas" replace />;
  if (user?.role === "aluno") return <Navigate to="/aluno/provas" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/usuarios" replace />;
  return <Navigate to="/login" replace />;
}
