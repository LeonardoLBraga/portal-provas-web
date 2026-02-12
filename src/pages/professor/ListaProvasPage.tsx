import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteExam, listExams } from "../../services/exams";
import type { Exam } from "../../types/exam";

export function ListaProvasPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listExams("professor")
      .then(setExams)
      .catch(() => setError("Erro ao carregar provas."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Excluir a prova "${title}"?`)) return;
    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError("Erro ao excluir prova.");
    }
  }

  if (loading) {
    return <p className="text-gray-500">Carregando provas...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Provas</h1>
        <Link
          to="/professor/provas/nova"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
        >
          Nova Prova
        </Link>
      </div>
      {error && (
        <p className="mb-4 text-red-600" role="alert">
          {error}
        </p>
      )}
      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma prova criada.{" "}
          <Link to="/professor/provas/nova" className="text-blue-600 hover:underline">
            Criar primeira prova
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duração
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4">
                    <Link
                      to={`/professor/provas/${exam.id}/questoes`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {exam.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {exam.duration_minutes} min
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/professor/provas/${exam.id}/editar`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/professor/provas/${exam.id}/resultados`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Resultados
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(exam.id, exam.title)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Excluir
                    </button>
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
