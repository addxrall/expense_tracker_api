const { PrismaClient } = require("@prisma/client");
import { extractSelection } from "../utils/extractSelections";
import { GraphQLResolveInfo } from "graphql";

interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

interface GetUserArgs extends GetUsersArgs {
  id: string;
}

interface UserInput {
  email: string;
  username?: string;
}

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUser = async ({ id }: GetUserArgs) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const createUser = async ({ email, username }: UserInput) => {
  console.log({ email, username });

  const createdUser = await prisma.user.create({
    data: {
      email,
      username,
    },
  });

  return createdUser;
};
