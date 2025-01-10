import "../lib/firebase";
import { Collection, IEntity, getRepository } from "fireorm";
import { Exclude } from "class-transformer";
// status unverified |verified

type role = "user" | "admin";
@Collection("users")
export class User implements IEntity {
  id!: string;
  username!: string;
  email!: string;

  @Exclude()
  password!: string;

  role!: role;
  full_name!: string;
  age?: number;
  phone?: string;
  image?: string;
  verificationCode?: string;
  verificationStatus?: string;

  created_at?: Date;
  updated_at?: Date;
}

export const userRepository = () => getRepository(User);
