export type Expense = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  userId: string;
  user: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  password: string;
  token: string;
};

export type RegisterUserInputT = {
  username: string;
  email: string;
  password: string;
};

export interface ExpenseInput {
  name: string;
  description?: string;
  tags?: string[];
  userId: number;
}
