// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      full_name: string;
      email: string;
      role: string;
      name?: string;
      image?: string;
      verificationStatus?: string;
    };
  }

  interface JWT {
    id: string;
    username: string;
    full_name: string;
    email: string;
    role: string;
    name?: string;
    image?: string;
  }

  interface User {
    id: string;
    username: string;
    full_name: string;
    email: string;
    role: string;
    verificationStatus?: string;
  }

  interface Profile {
    picture?: string;
    avatar_url?: string;
    login?: string;
  }
}
