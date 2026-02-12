import type { CreateUserInput, UpdateUserInput, User } from "../types/auth";

const STORAGE_KEY = "portal_provas_users";

interface UserWithPassword extends User {
  password: string;
}

interface UsersStore {
  users: UserWithPassword[];
  nextId: number;
}

const INITIAL_USERS: UserWithPassword[] = [
  {
    id: 1,
    name: "Aluno Teste",
    email: "aluno@teste.com",
    role: "aluno",
    password: "123456",
  },
  {
    id: 2,
    name: "Professor Teste",
    email: "professor@teste.com",
    role: "professor",
    password: "123456",
  },
  {
    id: 3,
    name: "Admin Teste",
    email: "admin@teste.com",
    role: "admin",
    password: "123456",
  },
  {
    id: 4,
    name: "Maria Silva",
    email: "maria@teste.com",
    role: "aluno",
    password: "123456",
  },
  {
    id: 5,
    name: "João Santos",
    email: "joao@teste.com",
    role: "professor",
    password: "123456",
  },
];

function getStore(): UsersStore {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as UsersStore;
    }
  } catch {
    // ignore
  }
  return {
    users: INITIAL_USERS,
    nextId: 6,
  };
}

function saveStore(store: UsersStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function getUserByEmail(email: string): (User & { password: string }) | null {
  const store = getStore();
  const u = store.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  return u ?? null;
}

export async function listUsers(
  role?: "professor" | "aluno"
): Promise<User[]> {
  await delay(200);
  const store = getStore();
  let list = store.users.filter((u) => u.role !== "admin");
  if (role) {
    list = list.filter((u) => u.role === role);
  }
  return list.map((u) => {
    const { password: _pass, ...user } = u;
    void _pass;
    return user;
  });
}

export async function getUser(id: number): Promise<User | null> {
  await delay(150);
  const store = getStore();
  const u = store.users.find((user) => user.id === id);
  if (!u) return null;
  const { password: _pass, ...user } = u;
  void _pass;
  return user;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  await delay(300);
  const store = getStore();
  const exists = store.users.some(
    (u) => u.email.toLowerCase() === input.email.toLowerCase()
  );
  if (exists) {
    throw new Error("Já existe um usuário com este email.");
  }
  const user: UserWithPassword = {
    id: store.nextId++,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    password: input.password,
  };
  store.users.push(user);
  saveStore(store);
  const { password: _pass, ...result } = user;
  void _pass;
  return result;
}

export async function updateUser(
  id: number,
  input: UpdateUserInput
): Promise<User | null> {
  await delay(300);
  const store = getStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  const current = store.users[idx];
  if (input.email !== undefined) {
    const email = input.email.trim().toLowerCase();
    const exists = store.users.some(
      (u) => u.id !== id && u.email.toLowerCase() === email
    );
    if (exists) {
      throw new Error("Já existe um usuário com este email.");
    }
    current.email = email;
  }
  if (input.name !== undefined) current.name = input.name.trim();
  if (input.role !== undefined) current.role = input.role;
  if (input.password !== undefined && input.password.trim() !== "") {
    current.password = input.password;
  }
  saveStore(store);
  const { password: _pass, ...result } = current;
  void _pass;
  return result;
}
