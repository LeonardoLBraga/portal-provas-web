import { useState, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/exams";

const INITIAL_OPTIONS = [
  { text: "", is_correct: false },
  { text: "", is_correct: false },
];

export function NovaQuestaoPage() {
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState("");
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const examId = Number(id);

  function setOption(idx: number, field: "text" | "is_correct", value: string | boolean) {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o))
    );
  }

  function addOption() {
    setOptions((prev) => [...prev, { text: "", is_correct: false }]);
  }

  function removeOption(idx: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("Informe o enunciado.");
      return;
    }
    const valid = options.filter((o) => o.text.trim());
    if (valid.length < 2) {
      setError("Adicione pelo menos 2 opções.");
      return;
    }
    if (!valid.some((o) => o.is_correct)) {
      setError("Marque a alternativa correta.");
      return;
    }
    setLoading(true);
    try {
      await createQuestion(examId, {
        text: text.trim(),
        options: valid.map((o) => ({ text: o.text.trim(), is_correct: o.is_correct })),
      });
      navigate(`/professor/provas/${examId}/questoes`);
    } catch {
      setError("Erro ao criar questão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        to={`/professor/provas/${examId}/questoes`}
        className="text-blue-600 hover:underline text-sm mb-4 block"
      >
        ← Voltar para questões
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nova Questão</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enunciado
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opções (marque a correta)
            </label>
            <div className="space-y-2">
              {options.map((o, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="correct"
                    checked={o.is_correct}
                    onChange={() => {
                      setOptions((prev) =>
                        prev.map((opt, i) => ({ ...opt, is_correct: i === idx }))
                      );
                    }}
                  />
                  <input
                    type="text"
                    value={o.text}
                    onChange={(e) => setOption(idx, "text", e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Texto da opção"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              + Adicionar opção
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md"
            >
              {loading ? "Salvando..." : "Criar"}
            </button>
            <Link
              to={`/professor/provas/${examId}/questoes`}
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
