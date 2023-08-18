import connectToDB from "@/lib/connectToDB";
import mongoose from "mongoose";
import User from "@/lib/models/mongoose/User";
// @ts-ignore
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { loginSchema } from "@/pages/login";
const bcrypt = require("bcrypt");

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials) {
        await loginSchema.validate(credentials);
        if (mongoose.connection.readyState === 0) await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) {
          throw new Error("Password does not match");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    // @ts-ignore
    session: ({ session, token }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    // @ts-ignore
    jwt: ({ token, user }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
