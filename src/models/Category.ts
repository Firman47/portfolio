import { Collection, getRepository, IEntity } from "fireorm";

import "../lib/firebase";

@Collection("categories")
export class Category implements IEntity {
  id!: string;
  name!: string;
  created_at?: Date;
  updated_at?: Date;
}

export const categoryRepository = () => getRepository(Category);
