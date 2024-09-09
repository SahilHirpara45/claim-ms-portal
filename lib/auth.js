import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import avatar3 from "@/public/images/avatar/avatar-3.jpg";
import { NextResponse } from "next/server";
const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

// export const user = [
//   {
//     id: 1,
//     name: "dashtail",
//     image: avatar3,
//     password: "password",
//     email: "dashtail@codeshaper.net",
//     resetToken: null,
//     resetTokenExpiry: null,
//     profile: null,
//   },
// ];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      // credentials: {
      //   email: { label: "Email", type: "email" },
      //   password: { label: "Password", type: "password" },
      // },
      // async authorize(credentials) {
      //   if (!credentials?.email || !credentials?.password) {
      //     throw new Error("Missing credentials");
      //   }
      //   const foundUser = user.find((u) => u.email === credentials.email);

      //   if (!foundUser) {
      //     throw new Error("User not found");
      //   }

      //   //  check correctPassword plain without bcrypt
      //   const correctPassword = credentials.password === foundUser.password;

      //   if (!correctPassword) {
      //     throw new Error("Invalid password");
      //   }

      //   return foundUser;
      // },
      // callbacks: {
      //   async signIn({ user }) {
      //     if (!user.email?.endsWith(process.env.ALLOWED_DOMAIN)) {
      //       throw new Error("You are not allowed to access this platform");
      //     }
      //     return true;
      //   },

      //   jwt: async ({ token, user }) => {
      //     if (user) {
      //       token.role = user.role;
      //     }
      //     return token;
      //   },
      //   async session({ session, token }) {
      //     if (session.user) {
      //       session.user.role = token.role;
      //     }
      //     return session;
      //   },
      // },
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials;
        console.log(credentials, "credentials");

        try {
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json();
            console.log(data, "data");
            throw new Error(data?.message);
          }

          const user = await response.json();
          console.log(user, "user");
          const userRole = user?.data?.userId?.role;
          const userFirstName = user?.data?.userId?.firstName;
          const userLastName = user?.data?.userId?.lastName;
          const userEmail = user?.data?.userId?.email;
          const userAvatar = user?.data?.userId?.avatar;
          const permissionId = user?.data?.userId?.permissionId;
          const jwt = user.token;

          return {
            ...credentials,
            jwt,
            role: userRole,
            userFirstName,
            userLastName,
            userEmail,
            userAvatar,
            permissionId,
          };
        } catch (error) {
          throw new Error(error?.message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.jwt = token.jwt;
        session.role = token.role;
        session.userFirstName = token.userFirstName;
        session.userLastName = token.userLastName;
        session.userEmail = token.userEmail;
        session.userAvatar = token.userAvatar;
        session.permissionId = token.permissionId;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          jwt: user.jwt,
          role: user.role,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
          userAvatar: user.userAvatar,
          permissionId: user.permissionId,
        };
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};
