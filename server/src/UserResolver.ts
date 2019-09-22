import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx
} from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { MyContext } from "./ApolloContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hey there from user resovler";
  }

  @Query(() => [User])
  async users() {
    return await User.find();
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
    res.cookie(
      "jid",
      sign({ userId: user.id }, "al;kas;dklf;", {
        expiresIn: "7d"
      }),
      {
        httpOnly: true
      }
    );

    return {
      accessToken: sign(
        { userId: user.id, userEmail: user.email },
        "asdlfajs;dlfka",
        { expiresIn: "15m" }
      )
    };
  }
}
