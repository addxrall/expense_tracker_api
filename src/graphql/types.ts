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
};

export interface ExpenseInput {
  name: string;
  description?: string;
  tags?: string[];
  userId: number;
}
