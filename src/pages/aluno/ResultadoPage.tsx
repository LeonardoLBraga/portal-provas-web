import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAttempt, getExam, getResult } from "../../services/exams";
import type { Attempt, ExamWithQuestions, Result } from "../../types/exam";

export function ResultadoPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [exam, setExam] = useState<ExamWithQuestions | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const id = Number(attemptId);

  useEffect(() => {
    if (!id) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    Promise.all([getAttempt(id), getResult(id)])
      .then(([attemptData, resultData]) => {
        setAttempt(attemptData ?? null);
        setResult(resultData ?? null);
        if (attemptData) return getExam(attemptData.exam_id);
        return null;
      })
      .then((examData) => {
        if (examData) setExam(examData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Carregando resultado...</p>;
  if (!attempt || !result)
    return (
      <div>
        <p className="text-red-600">Resultado não encontrado.</p>
        <Link to="/aluno/provas" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar
        </Link>
      </div>
    );

  const passed = result.score >= 6;

  return (
    <div>
      <div
        className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto text-center"
        role="status"
        aria-live="polite"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {exam?.title ?? "Prova"}
        </h1>
        <p className="text-gray-500 mb-6">Prova finalizada</p>
        <div
          className={`text-5xl font-bold mb-4 ${passed ? "text-green-600" : "text-red-600"}`}
        >
          {result.score.toFixed(1)}
        </div>
        <p className="text-gray-600 mb-2">
          Acertos: {result.correct_count} de {result.total_questions}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          {passed ? "Parabéns, você foi aprovado!" : "Você não atingiu a nota mínima."}
        </p>
        <Link
          to="/aluno/provas"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          Voltar para provas
        </Link>
      </div>
    </div>
  );
}
