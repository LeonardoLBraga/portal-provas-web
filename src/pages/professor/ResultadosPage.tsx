import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExams } from "../../services/exams";
import type { Exam } from "../../types/exam";

export function ResultadosPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listExams("professor")
      .then(setExams)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resultados das Provas</h1>
      {exams.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma prova criada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              to={`/professor/provas/${exam.id}/resultados`}
              className="bg-white rounded-lg shadow p-4 block hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-gray-800">{exam.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Ver resultados →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
