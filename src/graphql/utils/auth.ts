const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const jwtToken = process.env.JWT;

export const auth = (context: any) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer")[1];

    if (token) {
      try {
        const user = jwt.verify(token, jwtToken);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Auth Token myust be Bearer {token}");
  }
  throw new Error("auth header must be provided");
};
