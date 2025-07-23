export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}
export interface User {
  id: string;
  username: string;
}
export interface AuthenticationResponse {
  access_token: string;
  user: User;
}
