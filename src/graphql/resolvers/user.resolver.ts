import { RegisterUserInputT } from "./../types";
import { GraphQLResolveInfo } from "graphql";
import { getUser, getUsers, registerUser } from "../services/user.service";

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
    // async createUser(_: any, { input }: Record<string, any>) {
    //   return await createUser({ email: input.email, username: input.username });
    // },
    async registerUser(
      _: any,
      { username, email, password }: RegisterUserInputT,
      context: any,
      info: GraphQLResolveInfo
    ) {
      return await registerUser({ username, email, password });
    },
  },
};
