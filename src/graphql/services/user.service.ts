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

export const createNewUser = async (
  { username, email, password }: RegisterUserInputT,
  res: any
) => {
  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  const existingUserEmail = await prisma.user.findUnique({ where: { email } });
  const existingUserUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUserEmail) {
    throw new Error("This email is already in use");
  }

  if (existingUserUsername) {
    throw new Error("This username is already in use");
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
    expiresIn: "7d",
  });

  console.log(`USER CREATED WITH EMAIL: ${email} AND USERNAME: ${username}`);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return { ...newUser, token, message: "user successfuklly registered" };
};

export const login = async ({ email, password }: LoginUserInputT, res: any) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, jwtKey, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    // secure: process.env.ENV === "prod",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  console.log(`LOGIN REQUEST FOR USER WITH EMAIL: ${email}`);

  return { userId: user.id, token, message: "logged in" };
};

export const logout = async (res: any) => {
  res.clearCookie("token");
  return { message: "Logout successful" };
};

export const isUserLoggedIn = async (req: any) => {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  try {
    const decodedToken = jwt.verify(token, jwtKey);
    const { email } = decodedToken;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { email };
    }

    return null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export const getCurrentUser = async (req: any) => {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  if (!jwtKey) {
    throw new Error("Cannot get JWT KEY from server files");
  }

  try {
    const decodedToken = jwt.verify(token, jwtKey);
    const { email } = decodedToken;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return {
        email: user.email,
        username: user.username,
        userId: user.id,
      };
    }
  } catch (err: any) {
    console.error(err);
  }
};
