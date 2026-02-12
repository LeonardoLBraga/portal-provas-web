import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listExams, startAttempt } from "../../services/exams";
import type { Exam } from "../../types/exam";

export function ProvasDisponiveisPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    listExams("aluno")
      .then(setExams)
      .catch(() => setError("Erro ao carregar provas."))
      .finally(() => setLoading(false));
  }, []);

  async function handleStart(examId: number) {
    setError("");
    setStarting(examId);
    try {
      const attempt = await startAttempt(examId);
      if (attempt) {
        navigate(`/aluno/provas/${examId}/fazer`);
      } else {
        setError("Não foi possível iniciar a prova.");
      }
    } catch {
      setError("Erro ao iniciar prova.");
    } finally {
      setStarting(null);
    }
  }

  if (loading) return <p className="text-gray-500">Carregando provas...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Provas Disponíveis</h1>
      {error && (
        <p className="mb-4 text-red-600" role="alert">
          {error}
        </p>
      )}
      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma prova disponível no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow p-6 flex flex-col"
            >
              <h2 className="font-semibold text-gray-800 text-lg">{exam.title}</h2>
              <p className="text-gray-500 text-sm mt-2 flex-1">{exam.description}</p>
              <p className="text-gray-400 text-xs mt-2">
                Duração: {exam.duration_minutes} minutos
              </p>
              <button
                type="button"
                onClick={() => handleStart(exam.id)}
                disabled={starting !== null}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition"
              >
                {starting === exam.id ? "Iniciando..." : "Iniciar Prova"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
