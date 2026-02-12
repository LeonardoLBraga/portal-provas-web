import axios, { type AxiosInstance } from "axios";
import type { LoginCredentials, LoginResponse } from "../types/auth";
import { getUserByEmail } from "./users";

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay(500);

  const userWithPass = getUserByEmail(credentials.email);
  if (!userWithPass || userWithPass.password !== credentials.password) {
    throw new Error("Email ou senha inválidos.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit password from response
  const { password, ...user } = userWithPass;
  return {
    token: `mock-jwt-${user.id}-${Date.now()}`,
    user,
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
