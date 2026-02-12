import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUsers } from "../../services/users";
import type { User } from "../../types/auth";

type RoleFilter = "todos" | "professor" | "aluno";

const ROLE_LABELS: Record<string, string> = {
  professor: "Professor",
  aluno: "Aluno",
  admin: "Admin",
};

export function ListaUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<RoleFilter>("todos");

  useEffect(() => {
    const role = filter === "todos" ? undefined : filter;
    listUsers(role)
      .then(setUsers)
      .catch(() => setError("Erro ao carregar usuários."))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
        <Link
          to="/admin/usuarios/novo"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          Novo usuário
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filtrar por papel:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as RoleFilter)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="todos">Todos</option>
          <option value="professor">Professores</option>
          <option value="aluno">Alunos</option>
        </select>
      </div>

      {error && (
        <p className="mb-4 text-red-600" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Carregando usuários...</p>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhum usuário encontrado.
          {filter !== "todos" && (
            <button
              type="button"
              onClick={() => setFilter("todos")}
              className="ml-2 text-blue-600 hover:underline"
            >
              Limpar filtro
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Papel
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/usuarios/${user.id}/editar`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
