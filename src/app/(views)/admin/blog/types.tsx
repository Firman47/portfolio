type statusBlog = "draft" | "published" | "deleted";

export interface BlogType {
  id: string;
  title: string;
  slug?: string;
  content: string;
  description: string;
  status: statusBlog;
  category_id: string[];
  created_at?: string | Date;
}
