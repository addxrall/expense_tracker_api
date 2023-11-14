import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql";
import { auth } from "./graphql/utils/auth";
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const prod = process.env.PROD;

app.use(cookieParser());

const bootstrapServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    cors({
      credentials: true,
      origin: `http://localhost:5173`,
    })
  );

  if (!prod) {
    app.use(helmet());
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(auth);
  app.use(
    "/api",
    expressMiddleware(server, {
      context: async ({ req, res }: any) => ({ req, res }),
    })
  );

  app.listen(port, () => {
    console.log(`🚀 Graphql ready at http://localhost:${port}/api`);
  });
};

bootstrapServer();
