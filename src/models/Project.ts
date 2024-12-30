import { Collection, getRepository, IEntity } from "fireorm";

import "../lib/firebase";

@Collection("projects")
export class Project implements IEntity {
  id!: string;
  name!: string;
  description!: string;
  image!: string;
  tech_stack!: Array<string>;
  project_url?: string;
  repository_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const projectRepository = () => getRepository(Project);
