const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT;

export const auth = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const { userId }: any = jwt.verify(token, jwtSecret);
      req.userId = userId;
    }
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
