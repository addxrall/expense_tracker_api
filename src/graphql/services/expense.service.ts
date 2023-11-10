const { PrismaClient } = require("@prisma/client");
import { GraphQLResolveInfo } from "graphql";
import { Expense, UpdateExpenseInput } from "../types";

interface GetExpenseArgs {
  id: string;
  info?: GraphQLResolveInfo;
}

interface ExpenseInput {
  id?: string;
  name: string;
  amount: number;
  description?: string;
  tags?: string[];
  userId: number;
}

const prisma = new PrismaClient();

export const getExpensesByUserId = async (userId: number) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error(`User does not exist`);
  }

  return await prisma.expense.findMany({
    where: {
      userId: userId,
    },
  });
};

export const getExpenseById = async ({
  id,
}: GetExpenseArgs): Promise<Expense | null> => {
  return await prisma.expense.findUnique({ where: { id } });
};

export const createExpense = async ({
  name,
  amount,
  description,
  tags,
  userId,
}: ExpenseInput) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userExists) {
    throw new Error(`User does not exist`);
  }

  const createdExpense = await prisma.expense.create({
    data: {
      name,
      amount,
      description,
      tags,
      userId,
    },
  });

  if (!createdExpense) {
    throw new Error("Failed to create expense");
  }

  return createdExpense;
};

export const updateExpense = async (
  input: UpdateExpenseInput,
  expenseId: string
) => {
  const existingExpense = await prisma.expense.findUnique({
    where: { id: expenseId },
  });

  if (!existingExpense) {
    throw new Error(`Expense with ID ${expenseId} does not exist`);
  }

  // Proceed with updating the expense
  const updatedExpense = await prisma.expense.update({
    where: { id: expenseId },
    data: input,
  });

  return updatedExpense;
};

export const deleteExpense = async ({
  id,
}: GetExpenseArgs): Promise<Expense | null> => {
  const expenseExists = await prisma.expense.findUnique({
    where: { id },
  });

  if (!expenseExists) {
    throw new Error(`Expense does not exist`);
  }
  const deletedExpense = await prisma.expense.delete({ where: { id } });
  return deletedExpense;
};
