import { Collection, getRepository, IEntity } from "fireorm";

import "../../lib/firebase";

type content_type = "blog" | "project";

@Collection("likes")
export class Like implements IEntity {
  id!: string;
  user_id!: string;
  content_id!: string;
  content_type!: content_type;
  created_at?: Date;
  updated_at?: Date;
  published_at?: Date;
}

export const blogRepository = () => getRepository(Like);
