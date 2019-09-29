import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from "bcryptjs";

import { MyContext } from "./ApolloContext";
import { createAccessToken, sendRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hey there";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `bye, see you userId : ${payload!.userEmail}`;
  }

  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPwd = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPwd
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw Error("Invalid user/User does not exist");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw Error("Invalid user/password");
    }
    const { res } = ctx;
    // refresh token in cookie
    sendRefreshToken(res, user);

    return {
      accessToken: createAccessToken(user)
    };
  }
}
