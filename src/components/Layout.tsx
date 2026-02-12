import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

function ProfessorNav() {
  const location = useLocation();
  const base = "/professor";
  const active = (path: string) =>
    location.pathname.startsWith(path) ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-600 hover:bg-gray-100";
  return (
    <nav className="flex gap-1">
      <Link
        to={`${base}/provas`}
        className={`px-4 py-2 rounded-md ${active(`${base}/provas`)}`}
      >
        Minhas Provas
      </Link>
      <Link
        to={`${base}/provas/nova`}
        className={`px-4 py-2 rounded-md ${active(`${base}/provas/nova`)}`}
      >
        Nova Prova
      </Link>
      <Link
        to={`${base}/resultados`}
        className={`px-4 py-2 rounded-md ${active(`${base}/resultados`)}`}
      >
        Resultados
      </Link>
    </nav>
  );
}

function AlunoNav() {
  const location = useLocation();
  const base = "/aluno";
  const active = (path: string) =>
    location.pathname.startsWith(path) ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-600 hover:bg-gray-100";
  return (
    <nav className="flex gap-1">
      <Link
        to={`${base}/provas`}
        className={`px-4 py-2 rounded-md ${active(`${base}/provas`)}`}
      >
        Provas Disponíveis
      </Link>
      <Link
        to={`${base}/tentativas`}
        className={`px-4 py-2 rounded-md ${active(`${base}/tentativas`)}`}
      >
        Minhas Tentativas
      </Link>
    </nav>
  );
}

function AdminNav() {
  const location = useLocation();
  const base = "/admin";
  const active = (path: string) =>
    location.pathname.startsWith(path) ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-600 hover:bg-gray-100";
  return (
    <nav className="flex gap-1">
      <Link
        to={`${base}/usuarios`}
        className={`px-4 py-2 rounded-md ${active(`${base}/usuarios`)}`}
      >
        Usuários
      </Link>
      <Link
        to={`${base}/usuarios/novo`}
        className={`px-4 py-2 rounded-md ${active(`${base}/usuarios/novo`)}`}
      >
        Novo Usuário
      </Link>
    </nav>
  );
}

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const role = user?.role as UserRole | undefined;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold text-gray-800">
              Portal de Provas
            </Link>
            {role === "professor" && <ProfessorNav />}
            {role === "aluno" && <AlunoNav />}
            {role === "admin" && <AdminNav />}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
