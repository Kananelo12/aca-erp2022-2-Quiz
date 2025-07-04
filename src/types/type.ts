export interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  concept: string;
}

export interface User {
  name: string;
  email: string;
  id: string;
}
export interface SignUpParams {
  uid?: string;
  name: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  idToken: string;
}
