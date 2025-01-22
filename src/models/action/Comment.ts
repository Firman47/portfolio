import { Collection, getRepository, IEntity } from "fireorm";

import "../../lib/firebase";
import { User } from "../User";

type content_type = "blog" | "project";

@Collection("comments")
export class Comment implements IEntity {
  id!: string;
  user_id!: string;
  parent_id?: string;
  content_id!: string;
  content_type!: content_type;
  text!: string;
  user?: User; // Replace `any` with the appropriate user type if available
  children?: Comment[];
  created_at?: Date;
  updated_at?: Date;
}

export const commentRepository = () => getRepository(Comment);
