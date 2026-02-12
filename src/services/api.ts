import axios, { type AxiosInstance } from "axios";
import type { LoginCredentials, LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

const MOCK_USERS: Record<string, { password: string; user: LoginResponse["user"] }> = {
  "aluno@teste.com": {
    password: "123456",
    user: {
      id: 1,
      name: "Aluno Teste",
      email: "aluno@teste.com",
      role: "aluno",
    },
  },
  "professor@teste.com": {
    password: "123456",
    user: {
      id: 2,
      name: "Professor Teste",
      email: "professor@teste.com",
      role: "professor",
    },
  },
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay(500);

  const mockUser = MOCK_USERS[credentials.email];
  if (!mockUser || mockUser.password !== credentials.password) {
    throw new Error("Email ou senha inválidos.");
  }

  return {
    token: `mock-jwt-${mockUser.user.id}-${Date.now()}`,
    user: mockUser.user,
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  if (API_URL) {
    const { data } = await api.post<LoginResponse>("/api/login", credentials);
    return data;
  }

  return mockLogin(credentials);
}
