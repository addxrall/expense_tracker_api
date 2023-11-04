const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
import { RegisterUserInputT } from "./../types";
import { GraphQLResolveInfo } from "graphql";

interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

interface GetUserArgs extends GetUsersArgs {
  id: number;
}

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUser = async ({ id }: GetUserArgs) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const createNewUser = async ({
  username,
  email,
  password,
}: RegisterUserInputT) => {
  const jwtKey = process.env.JWT;
  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, jwtKey, {
    expiresIn: "2h",
  });

  newUser.token = token;

  await prisma.user.update({
    where: { id: newUser.id },
    data: { token },
  });

  console.log(`USER CREATED WITH EMAIL: ${email} AND USERNAME: ${username}`);

  return newUser;
};
