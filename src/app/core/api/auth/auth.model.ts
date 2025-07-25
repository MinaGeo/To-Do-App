export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  passwordHash?: string;
}

export interface AuthenticationResponse {
  access_token: string;
  user: User;
}
