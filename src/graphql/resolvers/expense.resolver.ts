import { GraphQLResolveInfo } from "graphql";
import {
  createExpense,
  getExpenseById,
  getExpensesByUserId,
  updateExpense,
  deleteExpense,
} from "../services/expense.service";
import { ExpenseInput, UpdateExpenseArgs, UpdateExpenseInput } from "../types";
import { userAuthResolver } from "../utils/authResolver";

export const expenseResolver = {
  Query: {
    getExpensesByUserId: userAuthResolver(
      async (_: any, args: { userId: number }) => {
        return await getExpensesByUserId(args.userId);
      }
    ),
    getExpenseById: userAuthResolver(
      async (
        _: any,
        args: { id: string },
        context: any,
        info: GraphQLResolveInfo
      ) => {
        return await getExpenseById({ id: args.id, info });
      }
    ),
  },
  Mutation: {
    createExpense: userAuthResolver(
      async (_: any, { input }: { input: ExpenseInput }, context: any) => {
        return await createExpense(input);
      }
    ),
    updateExpense: userAuthResolver(
      async (_: any, { input, expenseId }: UpdateExpenseArgs, context: any) => {
        const { name, amount, description, tags, userId } = input;

        const filteredInput: UpdateExpenseInput = {
          name: name!,
          amount: amount!,
          description: description!,
          tags: tags!,
          userId: userId!,
        };

        return await updateExpense(filteredInput, expenseId);
      }
    ),
    deleteExpense: userAuthResolver(
      async (_: any, { id }: { id: string }, context: any) => {
        return await deleteExpense({ id });
      }
    ),
  },
};
