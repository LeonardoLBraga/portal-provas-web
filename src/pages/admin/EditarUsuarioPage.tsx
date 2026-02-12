import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../services/users";
import type { UpdateUserInput, UserRole } from "../../types/auth";

const ROLES: UserRole[] = ["aluno", "professor"];

export function EditarUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("aluno");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = Number(id);

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    getUser(userId)
      .then((user) => {
        if (user && user.role !== "admin") {
          setName(user.name);
          setEmail(user.email);
          setRole(user.role);
        } else {
          setError(user ? "Não é possível editar usuário admin." : "Usuário não encontrado.");
        }
      })
      .catch(() => setError("Erro ao carregar usuário."))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Informe o nome.");
      return;
    }
    if (!email.trim()) {
      setError("Informe o email.");
      return;
    }
    if (password.length > 0 && password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSaving(true);
    try {
      const input: UpdateUserInput = {
        name: name.trim(),
        email: email.trim(),
        role,
      };
      if (password.trim() !== "") {
        input.password = password;
      }
      await updateUser(userId, input);
      navigate("/admin/usuarios");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar usuário.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div>
      <Link
        to="/admin/usuarios"
        className="text-blue-600 hover:underline text-sm mb-4 block"
      >
        ← Voltar para usuários
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Usuário</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nova senha (deixe em branco para não alterar)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Papel
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r === "professor" ? "Professor" : "Aluno"}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <Link
              to="/admin/usuarios"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
