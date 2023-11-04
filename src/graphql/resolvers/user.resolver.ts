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
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await getUsers();
    },
    async user(
      _: any,
      args: Record<string, any>,
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await getUser({ id: args.id, info });
    },
  },
  Mutation: {
    async registerUser(
      _: any,
      { registerUserInput }: { registerUserInput: RegisterUserInputT },
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await createNewUser(registerUserInput);
    },
    async loginUser(
      _: any,
      { loginUserInput }: { loginUserInput: LoginUserInputT },
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await login(loginUserInput);
    },
  },
};
