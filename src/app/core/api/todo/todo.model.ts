export interface Todo {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
}

export interface TodoResponse {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
}
