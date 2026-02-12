import { useAuth } from "../hooks/useAuth";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Bem-vindo, {user?.name}
          </h1>
          <p className="text-gray-500 mb-4">
            Você está logado como <strong>{user?.role}</strong> ({user?.email})
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Esta é uma página placeholder. As funcionalidades de provas serão
            implementadas nos próximos passos.
          </p>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
