import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExam,
  startAttempt,
  submitAttempt,
} from "../../services/exams";
import type { Answer, Attempt, ExamWithQuestions } from "../../types/exam";

function Timer({ minutes, onExpire }: { minutes: number; onExpire: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, onExpire]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const isLow = secondsLeft <= 60;
  return (
    <span
      className={`font-mono font-bold ${isLow ? "text-red-600" : "text-gray-800"}`}
    >
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function FazerProvaPage() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamWithQuestions | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const examId = Number(id);

  useEffect(() => {
    if (!examId) {
      setLoading(false);
      return;
    }
    Promise.all([getExam(examId), startAttempt(examId)])
      .then(([examData, attemptData]) => {
        if (examData) setExam(examData);
        else setError("Prova não encontrada.");
        if (attemptData) setAttempt(attemptData);
      })
      .catch(() => setError("Erro ao carregar prova."))
      .finally(() => setLoading(false));
  }, [examId]);

  const handleSubmit = useCallback(async () => {
    if (!exam || !attempt) return;
    const totalAnswered = Object.keys(answers).length;
    if (
      totalAnswered < exam.questions.length &&
      !window.confirm(
        `Você respondeu ${totalAnswered} de ${exam.questions.length} questões. Deseja enviar mesmo assim?`
      )
    )
      return;
    setSubmitting(true);
    setError("");
    const answerList: Answer[] = Object.entries(answers).map(([qId, optId]) => ({
      question_id: Number(qId),
      option_id: optId,
    }));
    try {
      const result = await submitAttempt(attempt.id, answerList);
      if (result) {
        navigate(`/aluno/tentativas/${attempt.id}/resultado`);
        return;
      }
      setError("Erro ao enviar respostas.");
    } catch {
      setError("Erro ao enviar prova.");
    } finally {
      setSubmitting(false);
    }
  }, [exam, attempt, answers, navigate]);

  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;
  const handleExpire = useCallback(() => {
    void submitRef.current();
  }, []);

  if (loading) return <p className="text-gray-500">Carregando prova...</p>;
  if (error && !exam)
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/aluno/provas")}
          className="text-blue-600 hover:underline mt-2"
        >
          Voltar
        </button>
      </div>
    );
  if (!exam) return null;

  const questions = exam.questions;
  const current = questions[currentIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
        <div className="flex items-center gap-4">
          <Timer minutes={exam.duration_minutes} onExpire={handleExpire} />
          <span className="text-gray-500 text-sm">
            Questão {currentIndex + 1} de {questions.length}
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`w-10 h-10 rounded-md font-medium transition ${
              idx === currentIndex
                ? "bg-blue-600 text-white"
                : answers[q.id]
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-500 text-sm mb-2">Questão {currentIndex + 1}</p>
        <p className="text-lg text-gray-800 mb-4">{current.text}</p>
        <div className="space-y-2">
          {current.options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-2 p-3 rounded-md cursor-pointer border transition ${
                answers[current.id] === opt.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`q-${current.id}`}
                checked={answers[current.id] === opt.id}
                onChange={() =>
                  setAnswers((prev) => ({ ...prev, [current.id]: opt.id }))
                }
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-md"
        >
          Anterior
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Próxima
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-md"
          >
            {submitting ? "Enviando..." : "Enviar Prova"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
