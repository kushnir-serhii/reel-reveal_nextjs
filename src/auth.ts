import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./db/db";
import User from "@/db/models/user";
import { signToken } from "@/db/utils";
import { authConfig } from "@/auth.config";

export interface IUserType {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image: string;
  googleId?: string;
  token?: string;
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          await connectDB();

          const user: IUserType | null = await User.findOne({
            email: credentials.email,
          }).lean<IUserType>();

          if (user) {
            const isMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isMatch) {
              return user;
            } else {
              throw new Error("Password is not correct");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error: any) {
          console.log("AUTH_ERROR_>>>>>>>>>>>>>>", error);
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // If signing out, clear the token
      if (user === null) {
        return null;
      }

      // Keep user data in the token (Credentials login)
      if (user && "_id" in user) {
        token.id = (user._id as { toString(): string }).toString();
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      // Google OAuth login - fetch MongoDB _id
      if (account?.provider === "google" && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean<IUserType>();
        if (dbUser && dbUser._id) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.image = dbUser.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // If no token, return null session (user is logged out)
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
          emailVerified: token.emailVerified as Date,
        };
      } else {
        // When the user is not logged in, set session.user to undefined instead of null
        session.user = { id: '', name: '', email: '', image: '', emailVerified: null }
      }

      return session;
    },


    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        await connectDB(); // Connect to MongoDB
        try {
          const userData: any = await User.findOne({ email: profile?.email });

          if (!userData) {
            // If no user exists, create a new user with Google OAuth
            await User.create({
              name: profile?.name,
              email: profile?.email,
              image: profile?.picture,
              googleId: account.providerAccountId,
              token: signToken(account.providerAccountId), // Store Google ID for future logins
            });
          }
        } catch (error) {
          console.log("Error in auth:", error);
        }
      }
      return true;
    },
  },
  trustHost: true,
});
