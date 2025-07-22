export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}
export interface AuthenticationResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
  };
}
