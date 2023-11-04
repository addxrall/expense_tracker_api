const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
import { LoginUserInputT, RegisterUserInputT } from "./../types";
import { GraphQLResolveInfo } from "graphql";

interface GetUsersArgs {
  info: GraphQLResolveInfo;
}

interface GetUserArgs extends GetUsersArgs {
  id: number;
}

const prisma = new PrismaClient();
const jwtKey = process.env.JWT;

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

export const login = async ({ email, password }: LoginUserInputT) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const jwtKey = process.env.JWT;
  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, jwtKey, {
    expiresIn: "2h",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { token },
  });

  console.log(`LOGIN REQUEST FOR USER WITH EMAIL: ${email}`);

  return { ...user, token };
};
