import type {
  Answer,
  Attempt,
  CreateExamInput,
  CreateQuestionInput,
  Exam,
  ExamWithQuestions,
  Question,
  Result,
} from "../types/exam";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_KEY = "portal_provas_mock_data";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function getStoredUser(): { id: number; role: string } | null {
  try {
    const json = localStorage.getItem("portal_provas_user");
    if (json) {
      const user = JSON.parse(json) as { id: number; role: string };
      return user;
    }
  } catch {
    // ignore
  }
  return null;
}

interface MockData {
  exams: Exam[];
  questions: Question[];
  attempts: Attempt[];
  results: Result[];
  nextExamId: number;
  nextQuestionId: number;
  nextOptionId: number;
  nextAttemptId: number;
}

function getMockData(): MockData {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as MockData;
    }
  } catch {
    // ignore
  }
  const professorId = 2;
  const initial: MockData = {
    nextExamId: 3,
    nextQuestionId: 7,
    nextOptionId: 15,
    nextAttemptId: 1,
    exams: [
      {
        id: 1,
        title: "Matemática Básica",
        description: "Prova de operações fundamentais",
        duration_minutes: 30,
        created_at: new Date().toISOString(),
        user_id: professorId,
      },
      {
        id: 2,
        title: "História do Brasil",
        description: "Independência e República",
        duration_minutes: 45,
        created_at: new Date().toISOString(),
        user_id: professorId,
      },
    ],
    questions: [
      {
        id: 1,
        exam_id: 1,
        text: "Quanto é 2 + 2?",
        order: 1,
        options: [
          { id: 1, text: "3", is_correct: false },
          { id: 2, text: "4", is_correct: true },
          { id: 3, text: "5", is_correct: false },
        ],
      },
      {
        id: 2,
        exam_id: 1,
        text: "Quanto é 5 × 3?",
        order: 2,
        options: [
          { id: 4, text: "15", is_correct: true },
          { id: 5, text: "8", is_correct: false },
          { id: 6, text: "12", is_correct: false },
        ],
      },
      {
        id: 3,
        exam_id: 2,
        text: "Em que ano o Brasil declarou independência?",
        order: 1,
        options: [
          { id: 7, text: "1820", is_correct: false },
          { id: 8, text: "1822", is_correct: true },
          { id: 9, text: "1830", is_correct: false },
        ],
      },
    ],
    attempts: [],
    results: [],
  };
  return initial;
}

function saveMockData(data: MockData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function listExams(role: "professor" | "aluno"): Promise<Exam[]> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const { data } = await fetch(`${API_URL}/api/exams?role=${role}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    return data;
  }
  const mock = getMockData();
  if (role === "professor") {
    const user = getStoredUser();
    return mock.exams.filter((e) => e.user_id === user?.id);
  }
  return mock.exams;
}

export async function getExam(id: number): Promise<ExamWithQuestions | null> {
  await delay(200);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const exam = mock.exams.find((e) => e.id === id);
  if (!exam) return null;
  const questions = mock.questions
    .filter((q) => q.exam_id === id)
    .sort((a, b) => a.order - b.order);
  return { ...exam, questions };
}

export async function createExam(input: CreateExamInput): Promise<Exam> {
  await delay(300);
  const user = getStoredUser();
  if (!user) throw new Error("Usuário não autenticado");
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const exam: Exam = {
    id: mock.nextExamId++,
    title: input.title,
    description: input.description,
    duration_minutes: input.duration_minutes,
    created_at: new Date().toISOString(),
    user_id: user.id,
  };
  mock.exams.push(exam);
  saveMockData(mock);
  return exam;
}

export async function updateExam(
  id: number,
  input: Partial<CreateExamInput>
): Promise<Exam | null> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const idx = mock.exams.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  mock.exams[idx] = { ...mock.exams[idx], ...input };
  saveMockData(mock);
  return mock.exams[idx];
}

export async function deleteExam(id: number): Promise<boolean> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  }
  const mock = getMockData();
  mock.exams = mock.exams.filter((e) => e.id !== id);
  mock.questions = mock.questions.filter((q) => q.exam_id !== id);
  saveMockData(mock);
  return true;
}

export async function createQuestion(
  examId: number,
  input: CreateQuestionInput
): Promise<Question | null> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${examId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const exam = mock.exams.find((e) => e.id === examId);
  if (!exam) return null;
  const maxOrder = Math.max(
    0,
    ...mock.questions.filter((q) => q.exam_id === examId).map((q) => q.order)
  );
  const options = input.options.map((o) => ({
    id: mock.nextOptionId++,
    text: o.text,
    is_correct: o.is_correct,
  }));
  const question: Question = {
    id: mock.nextQuestionId++,
    exam_id: examId,
    text: input.text,
    options,
    order: maxOrder + 1,
  };
  mock.questions.push(question);
  saveMockData(mock);
  return question;
}

export async function updateQuestion(
  examId: number,
  questionId: number,
  input: Partial<CreateQuestionInput>
): Promise<Question | null> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(
      `${API_URL}/api/exams/${examId}/questions/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const idx = mock.questions.findIndex(
    (q) => q.exam_id === examId && q.id === questionId
  );
  if (idx < 0) return null;
  if (input.text) mock.questions[idx].text = input.text;
  if (input.options) {
    const existingIds = mock.questions[idx].options.map((o) => o.id);
    mock.questions[idx].options = input.options.map((o, idxOpt) => ({
      id: existingIds[idxOpt] ?? mock.nextOptionId++,
      text: o.text,
      is_correct: o.is_correct,
    }));
  }
  saveMockData(mock);
  return mock.questions[idx];
}

export async function deleteQuestion(
  examId: number,
  questionId: number
): Promise<boolean> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(
      `${API_URL}/api/exams/${examId}/questions/${questionId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.ok;
  }
  const mock = getMockData();
  mock.questions = mock.questions.filter(
    (q) => !(q.exam_id === examId && q.id === questionId)
  );
  saveMockData(mock);
  return true;
}

export async function startAttempt(examId: number): Promise<Attempt | null> {
  await delay(300);
  const user = getStoredUser();
  if (!user) throw new Error("Usuário não autenticado");
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${examId}/attempts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const exam = mock.exams.find((e) => e.id === examId);
  if (!exam) return null;
  const existing = mock.attempts.find(
    (a) => a.exam_id === examId && a.user_id === user.id && a.status === "in_progress"
  );
  if (existing) return existing;
  const attempt: Attempt = {
    id: mock.nextAttemptId++,
    exam_id: examId,
    user_id: user.id,
    started_at: new Date().toISOString(),
    submitted_at: null,
    status: "in_progress",
  };
  mock.attempts.push(attempt);
  saveMockData(mock);
  return attempt;
}

export async function submitAttempt(
  attemptId: number,
  answers: Answer[]
): Promise<Result | null> {
  await delay(500);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const attempt = mock.attempts.find((a) => a.id === attemptId);
  if (!attempt) return null;
  const questions = mock.questions.filter((q) => q.exam_id === attempt.exam_id);
  let correct = 0;
  for (const ans of answers) {
    const q = questions.find((qu) => qu.id === ans.question_id);
    const opt = q?.options.find((o) => o.id === ans.option_id);
    if (opt?.is_correct) correct++;
  }
  const total = questions.length;
  const score = total > 0 ? (correct / total) * 10 : 0;
  const result: Result = {
    attempt_id: attemptId,
    score,
    total_questions: total,
    correct_count: correct,
  };
  attempt.status = "submitted";
  attempt.submitted_at = new Date().toISOString();
  mock.results.push(result);
  saveMockData(mock);
  return result;
}

export async function getResult(attemptId: number): Promise<Result | null> {
  await delay(200);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/attempts/${attemptId}/result`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  return mock.results.find((r) => r.attempt_id === attemptId) ?? null;
}

export interface ResultWithAttempt extends Result {
  attempt: Attempt;
  student_name: string;
}

export async function listResults(examId: number): Promise<ResultWithAttempt[]> {
  await delay(300);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/exams/${examId}/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  const exam = mock.exams.find((e) => e.id === examId);
  if (!exam) return [];
  return mock.results
    .filter((r) => {
      const a = mock.attempts.find((at) => at.id === r.attempt_id);
      return a?.exam_id === examId && a?.status === "submitted";
    })
    .map((r) => {
      const attempt = mock.attempts.find((a) => a.id === r.attempt_id)!;
      return {
        ...r,
        attempt,
        student_name: attempt.user_id === 1 ? "Aluno Teste" : `Usuário ${attempt.user_id}`,
      };
    });
}

export async function getAttempt(attemptId: number): Promise<Attempt | null> {
  await delay(200);
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/attempts/${attemptId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  return mock.attempts.find((a) => a.id === attemptId) ?? null;
}

export interface AttemptWithExam extends Attempt {
  exam_title: string;
}

export async function listMyAttempts(): Promise<AttemptWithExam[]> {
  await delay(300);
  const user = getStoredUser();
  if (!user) return [];
  if (API_URL) {
    const token = localStorage.getItem("portal_provas_token");
    const res = await fetch(`${API_URL}/api/attempts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return data;
  }
  const mock = getMockData();
  return mock.attempts
    .filter((a) => a.user_id === user.id)
    .map((a) => {
      const exam = mock.exams.find((e) => e.id === a.exam_id);
      return { ...a, exam_title: exam?.title ?? "Prova" };
    })
    .sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
}
