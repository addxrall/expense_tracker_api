export type Expense = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  userId: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

export type RegisterUserInputT = {
  username: string;
  email: string;
  password: string;
};

export type LoginUserInputT = {
  email: string;
  password: string;
};

export interface ExpenseInput {
  name: string;
  amount: number;
  description?: string;
  tags?: string[];
  userId: number;
}

export interface UpdateExpenseInput {
  name?: string;
  amount?: number;
  description?: string;
  tags?: string[];
  userId: number;
}

export interface UpdateExpenseArgs {
  input: {
    name?: string;
    amount?: number;
    description?: string;
    tags?: string[];
    userId?: number;
  };
  expenseId: string;
}

export type DeletedExpenseOutput = {
  expense: Expense;
  message: string;
};
