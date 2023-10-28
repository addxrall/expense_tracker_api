const { PrismaClient } = require("@prisma/client");
import { GraphQLResolveInfo } from "graphql";
import { Expense } from "../types";

interface GetExpenseArgs {
  id: string;
  info?: GraphQLResolveInfo;
}

interface ExpenseInput {
  id?: string;
  name: string;
  description?: string;
  tags?: string[];
  userId: number;
}

const prisma = new PrismaClient();

export const getExpensesByUserId = async (userId: number) => {
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
  description,
  tags,
  userId,
}: ExpenseInput) => {
  const createdExpense = await prisma.expense.create({
    data: {
      name,
      description,
      tags,
      userId: userId,
    },
  });

  if (!createdExpense) {
    throw new Error("Failed to create expense");
  }

  return createdExpense;
};

export const updateExpense = async ({
  id,
  name,
  description,
  tags,
}: ExpenseInput & { id: string }): Promise<Expense> => {
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      name,
      description,
      tags: {
        set: tags,
      },
    },
  });

  return updatedExpense;
};

export const deleteExpense = async ({
  id,
}: GetExpenseArgs): Promise<Expense | null> => {
  const deletedExpense = await prisma.expense.delete({ where: { id } });
  return deletedExpense;
};
