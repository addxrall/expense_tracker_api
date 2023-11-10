import { LoginUserInputT, RegisterUserInputT } from "./../types";
import { GraphQLResolveInfo } from "graphql";
import {
  getUser,
  getUsers,
  createNewUser,
  login,
  logout,
} from "../services/user.service";
import { userAuthResolver } from "../utils/authResolver";

export const usersResolver = {
  Query: {
    users: userAuthResolver(
      async (_: any, args: any, context: any, info: GraphQLResolveInfo) => {
        return await getUsers();
      }
    ),
    user: userAuthResolver(
      async (_: any, args: any, context: any, info: GraphQLResolveInfo) => {
        return await getUser({ id: args.id, info });
      }
    ),
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
    async logoutUser(
      _: any,
      args: any,
      { res }: any,
      info: GraphQLResolveInfo
    ) {
      return await logout(res);
    },
  },
};
