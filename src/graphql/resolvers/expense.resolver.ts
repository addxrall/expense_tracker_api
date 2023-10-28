import { GraphQLResolveInfo } from "graphql";
import {
  createExpense,
  getExpenseById,
  getExpensesByUserId,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";
import { ExpenseInput } from "../types";

export const expenseResolver = {
  Query: {
    async getExpensesByUserId(
      _: any,
      args: { userId: number },
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await getExpensesByUserId(args.userId);
    },
    async getExpenseById(
      _: any,
      args: { id: string },
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await getExpenseById({ id: args.id, info });
    },
  },
  Mutation: {
    async createExpense(_: any, { input }: { input: ExpenseInput }) {
      return await createExpense({
        name: input.name,
        description: input.description,
        tags: input.tags,
        userId: input.userId,
      });
    },
    async updateExpense(_: any, { input }: Record<string, any>) {
      return await updateExpense(input);
    },
    async deleteExpense(_: any, { id }: { id: string }) {
      return await deleteExpense({ id });
    },
  },
};
