import { GraphQLResolveInfo } from "graphql/type";

export const userAuthResolver = (resolverFunction: any) => {
  return async (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => {
    if (!context.req.userId) {
      throw new Error("Authentication required");
    }
    return await resolverFunction(parent, args, context, info);
  };
};
