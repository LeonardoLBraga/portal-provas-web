import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteQuestion, getExam } from "../../services/exams";
import type { ExamWithQuestions, Question } from "../../types/exam";

export function QuestoesPage() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const examId = Number(id);
    if (!examId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    getExam(examId)
      .then((data) => {
        if (data) setExam(data);
        else setError("Prova não encontrada.");
      })
      .catch(() => setError("Erro ao carregar prova."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete(question: Question) {
    if (!window.confirm(`Excluir a questão "${question.text.slice(0, 50)}..."?`))
      return;
    try {
      await deleteQuestion(Number(id), question.id);
      setExam((prev) =>
        prev ? { ...prev, questions: prev.questions.filter((q) => q.id !== question.id) } : null
      );
    } catch {
      setError("Erro ao excluir questão.");
    }
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>;
  if (error || !exam)
    return (
      <div>
        <p className="text-red-600">{error || "Prova não encontrada."}</p>
        <Link to="/professor/provas" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/professor/provas" className="text-blue-600 hover:underline text-sm mb-1 block">
            ← Voltar para provas
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Questões: {exam.title}
          </h1>
        </div>
        <Link
          to={`/professor/provas/${id}/questoes/nova`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Adicionar questão
        </Link>
      </div>
      {exam.questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nenhuma questão.{" "}
          <Link
            to={`/professor/provas/${id}/questoes/nova`}
            className="text-blue-600 hover:underline"
          >
            Adicionar primeira questão
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {exam.questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-start"
            >
              <div>
                <span className="text-gray-500 font-medium">Questão {idx + 1}</span>
                <p className="mt-1 text-gray-800">{q.text}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                  {q.options.map((o) => (
                    <li key={o.id}>
                      {o.text}
                      {o.is_correct && (
                        <span className="text-green-600 ml-1">(correta)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/professor/provas/${id}/questoes/${q.id}/editar`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(q)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
