import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyAttempts } from "../../services/exams";
import type { AttemptWithExam } from "../../services/exams";

export function MinhasTentativasPage() {
  const [attempts, setAttempts] = useState<AttemptWithExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyAttempts()
      .then(setAttempts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Carregando tentativas...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Tentativas</h1>
      {attempts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma tentativa realizada.{" "}
          <Link to="/aluno/provas" className="text-blue-600 hover:underline">
            Ver provas disponíveis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{a.exam_title}</h2>
                <p className="text-sm text-gray-500">
                  Iniciada em{" "}
                  {new Date(a.started_at).toLocaleString("pt-BR")}
                  {a.status === "submitted" && (
                    <> · Enviada em {new Date(a.submitted_at!).toLocaleString("pt-BR")}</>
                  )}
                </p>
              </div>
              {a.status === "submitted" ? (
                <Link
                  to={`/aluno/tentativas/${a.id}/resultado`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                >
                  Ver resultado
                </Link>
              ) : (
                <Link
                  to={`/aluno/provas/${a.exam_id}/fazer`}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md"
                >
                  Continuar
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
