import { expenseResolver } from "./resolvers/expense.resolver";
import { readFileSync } from "fs";
import path from "path";
import { usersResolver } from "./resolvers/user.resolver";

const userTypes = readFileSync(
  path.join(__dirname, "./typeDefs/user.graphql"),
  {
    encoding: "utf-8",
  }
);

const expenseTypes = readFileSync(
  path.join(__dirname, "./typeDefs/expense.graphql"),
  {
    encoding: "utf-8",
  }
);

export const typeDefs = `
    ${userTypes}
    ${expenseTypes}
`;

export const resolvers = {
  Query: {
    ...usersResolver.Query,
    ...expenseResolver.Query,
  },
  Mutation: {
    ...usersResolver.Mutation,
    ...expenseResolver.Mutation,
  },
};
