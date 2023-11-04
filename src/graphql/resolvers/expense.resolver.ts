import { GraphQLResolveInfo } from "graphql";
import {
  createExpense,
  getExpenseById,
  getExpensesByUserId,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";
import { ExpenseInput, UpdateExpenseArgs, UpdateExpenseInput } from "../types";

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
      return await createExpense(input);
    },
    async updateExpense(_: any, { input, expenseId }: UpdateExpenseArgs) {
      const { name, amount, description, tags, userId } = input;

      const filteredInput: UpdateExpenseInput = {
        name: name!,
        amount: amount!,
        description: description!,
        tags: tags!,
        userId: userId!,
      };

      return await updateExpense(filteredInput, expenseId);
    },
    async deleteExpense(_: any, { id }: { id: string }) {
      return await deleteExpense({ id });
    },
  },
};
