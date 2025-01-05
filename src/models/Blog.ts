import { Collection, getRepository, IEntity } from "fireorm";

import "../lib/firebase";

type status = "draft" | "published" | "deleted";

@Collection("blogs")
export class Blog implements IEntity {
  id!: string;
  title!: string;
  slug!: string;
  content!: string;
  status!: status;
  category_id!: string[];
  description!: string;
  created_at?: Date;
  updated_at?: Date;
  published_at?: Date;
}

export const blogRepository = () => getRepository(Blog);
