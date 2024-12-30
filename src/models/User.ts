import "../lib/firebase";
import { Collection, IEntity, getRepository } from "fireorm";
import { Exclude } from "class-transformer";

@Collection("users")
export class User implements IEntity {
  id!: string;
  name!: string;
  email!: string;

  @Exclude()
  password!: string;

  age?: number;
  phone?: string;
  profilePicture?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userRepository = () => getRepository(User);
