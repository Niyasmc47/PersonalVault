export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  provider?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
