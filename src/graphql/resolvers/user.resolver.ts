import { LoginUserInputT, RegisterUserInputT } from "./../types";
import { GraphQLResolveInfo } from "graphql";
import {
  getUser,
  getUsers,
  createNewUser,
  login,
} from "../services/user.service";

export const usersResolver = {
  Query: {
    async users(
      _: any,
      args: Record<string, any>,
      { req }: any,
      info: GraphQLResolveInfo
    ) {
      if (!req.userId) {
        throw new Error("Authentication required");
      }

      return await getUsers();
    },
    async user(
      _: any,
      args: Record<string, any>,
      { req }: any,
      info: GraphQLResolveInfo
    ) {
      if (!req.userId) {
        throw new Error("Authentication required");
      }

      return await getUser({ id: args.id, info });
    },
  },
  Mutation: {
    async registerUser(
      _: any,
      { registerUserInput }: { registerUserInput: RegisterUserInputT },
      { res }: any,
      info: GraphQLResolveInfo
    ) {
      return await createNewUser(registerUserInput, res);
    },
    async loginUser(
      _: any,
      { loginUserInput }: { loginUserInput: LoginUserInputT },
      { res }: any,
      info: GraphQLResolveInfo
    ) {
      return await login(loginUserInput, res);
    },
  },
};
