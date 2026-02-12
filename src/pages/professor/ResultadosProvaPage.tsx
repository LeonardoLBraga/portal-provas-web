import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getExam, listResults } from "../../services/exams";
import type { ExamWithQuestions } from "../../types/exam";
import type { ResultWithAttempt } from "../../services/exams";

export function ResultadosProvaPage() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamWithQuestions | null>(null);
  const [results, setResults] = useState<ResultWithAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const examId = Number(id);

  useEffect(() => {
    if (!examId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    Promise.all([getExam(examId), listResults(examId)])
      .then(([examData, resultsData]) => {
        setExam(examData ?? null);
        setResults(resultsData);
      })
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <p className="text-gray-500">Carregando...</p>;
  if (!exam)
    return (
      <div>
        <p className="text-red-600">Prova não encontrada.</p>
        <Link to="/professor/resultados" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );

  return (
    <div>
      <Link
        to="/professor/resultados"
        className="text-blue-600 hover:underline text-sm mb-4 block"
      >
        ← Voltar para resultados
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Resultados: {exam.title}</h1>
      <p className="text-gray-500 mb-6">{exam.questions.length} questões</p>
      {results.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma tentativa enviada para esta prova.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acertos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nota
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((r) => (
                <tr key={r.attempt_id}>
                  <td className="px-6 py-4 text-gray-800">{r.student_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.attempt.submitted_at
                      ? new Date(r.attempt.submitted_at).toLocaleString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.correct_count}/{r.total_questions}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {r.score.toFixed(1)}
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
