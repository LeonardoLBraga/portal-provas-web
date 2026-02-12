import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "../components/Layout";
import { RoleRoute } from "../components/RoleRoute";
import { LoginPage } from "../pages/LoginPage";
import { HomeRedirect } from "../pages/HomeRedirect";
import { ListaProvasPage } from "../pages/professor/ListaProvasPage";
import { NovaProvaPage } from "../pages/professor/NovaProvaPage";
import { EditarProvaPage } from "../pages/professor/EditarProvaPage";
import { QuestoesPage } from "../pages/professor/QuestoesPage";
import { NovaQuestaoPage } from "../pages/professor/NovaQuestaoPage";
import { EditarQuestaoPage } from "../pages/professor/EditarQuestaoPage";
import { ResultadosPage } from "../pages/professor/ResultadosPage";
import { ResultadosProvaPage } from "../pages/professor/ResultadosProvaPage";
import { ProvasDisponiveisPage } from "../pages/aluno/ProvasDisponiveisPage";
import { FazerProvaPage } from "../pages/aluno/FazerProvaPage";
import { ResultadoPage } from "../pages/aluno/ResultadoPage";
import { MinhasTentativasPage } from "../pages/aluno/MinhasTentativasPage";
import { ListaUsuariosPage } from "../pages/admin/ListaUsuariosPage";
import { NovoUsuarioPage } from "../pages/admin/NovoUsuarioPage";
import { EditarUsuarioPage } from "../pages/admin/EditarUsuarioPage";

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute />}>
        <Route index element={<LoginPage />} />
      </Route>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<HomeRedirect />} />
        <Route path="professor" element={<RoleRoute allowedRole="professor" />}>
          <Route element={<Layout />}>
            <Route path="provas" element={<ListaProvasPage />} />
            <Route path="provas/nova" element={<NovaProvaPage />} />
            <Route path="provas/:id/editar" element={<EditarProvaPage />} />
            <Route path="provas/:id/questoes" element={<QuestoesPage />} />
            <Route path="provas/:id/questoes/nova" element={<NovaQuestaoPage />} />
            <Route path="provas/:id/questoes/:qId/editar" element={<EditarQuestaoPage />} />
            <Route path="provas/:id/resultados" element={<ResultadosProvaPage />} />
            <Route path="resultados" element={<ResultadosPage />} />
          </Route>
        </Route>
        <Route path="aluno" element={<RoleRoute allowedRole="aluno" />}>
          <Route element={<Layout />}>
            <Route path="provas" element={<ProvasDisponiveisPage />} />
            <Route path="provas/:id/fazer" element={<FazerProvaPage />} />
            <Route path="tentativas" element={<MinhasTentativasPage />} />
            <Route path="tentativas/:attemptId/resultado" element={<ResultadoPage />} />
          </Route>
        </Route>
        <Route path="admin" element={<RoleRoute allowedRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="usuarios" element={<ListaUsuariosPage />} />
            <Route path="usuarios/novo" element={<NovoUsuarioPage />} />
            <Route path="usuarios/:id/editar" element={<EditarUsuarioPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
