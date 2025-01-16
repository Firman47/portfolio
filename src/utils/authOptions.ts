// app/api/auth/[...nextauth]/route.ts

import { User, userRepository } from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import bcrypt from "bcrypt";

const repository = userRepository();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", // Gunakan JWT untuk session
  },

  secret: process.env.JWT_SECRET || "fallback-secret", // Secret JWT

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username_or_email: { label: "Username_or_email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Pastikan credentials tidak undefined
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { username_or_email, password } = credentials;

        let findData = await repository
          .whereEqualTo("username", username_or_email)
          .find();

        // If username is not found, search by email
        if (!findData || findData.length === 0) {
          findData = await repository
            .whereEqualTo("email", username_or_email)
            .find();
        }

        if (!findData || findData.length === 0) {
          return null;
        }

        const result = findData[0];

        const passwordComparre = await bcrypt.compare(
          password,
          result.password
        );

        if (passwordComparre) {
          return result;
        } else {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "your-github-client-id",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "your-github-client-secret",
    }),
  ],

  pages: {
    signIn: "/auth/signin", // Alamat halaman sign-in custom
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const email = profile?.email;
          const fullName = profile?.name || profile?.login || "";
          const image =
            account?.provider === "google"
              ? profile?.picture
              : account?.provider === "github"
              ? profile?.avatar_url
              : "";

          const existingUser = await repository
            .whereEqualTo("email", email as string)
            .findOne();

          if (!existingUser) {
            const newUser = new User();
            newUser.role = "user";
            newUser.email = email as string;
            newUser.full_name = fullName as string;
            newUser.image = image as string;
            newUser.created_at = new Date();
            newUser.verificationStatus = "verified";

            await repository.create(newUser);
          } else {
            existingUser.full_name = fullName as string;
            existingUser.image = image as string;
            existingUser.updated_at = new Date();
            existingUser.verificationStatus = "verified";

            await repository.update(existingUser);
          }

          return true; // Return true jika berhasil
        } catch (error) {
          console.error("Error saving Google user to database:", error);
          return false; // Return false jika gagal
        }
      }

      return true; // Allow login for other providers
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.full_name = user.full_name;
        token.role = user.role;
        token.image = user.image;
        token.verificationStatus = user.verificationStatus;
      }

      if (account?.provider === "google" && account.id_token) {
        token.accessToken = account.access_token; // Token akses Google
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.full_name = user.full_name;
        token.role = user.role;
        token.image = user.image;
        token.verificationStatus = "verified";
      }

      if (account?.provider === "github" && account.access_token) {
        token.accessToken = account.access_token; // Token akses GitHub
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.full_name = user.full_name;
        token.role = user.role;
        token.image = user.image;
        token.verificationStatus = "verified";
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          email: token.email as string,
          full_name: token.full_name as string,
          role: token.role as string,
          image: token.image as string,
          verificationStatus: token.verificationStatus as string,
        };

        const updatedUserFromDB = await repository
          .whereEqualTo("email", token.email as string)
          .findOne();

        session.user = {
          ...session.user,
          id: updatedUserFromDB?.id as string,
          image: updatedUserFromDB?.image as string,
          role: updatedUserFromDB?.role as string,
          verificationStatus: updatedUserFromDB?.verificationStatus as string,
        };
      }

      return session;
    },
  },
};
