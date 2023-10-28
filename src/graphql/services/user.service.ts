const { PrismaClient } = require("@prisma/client");
import { GraphQLResolveInfo } from "graphql";
import { User } from "../types";

interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

interface GetUserArgs extends GetUsersArgs {
  id: number;
}

interface UserInput {
  email: string;
  username: string;
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
