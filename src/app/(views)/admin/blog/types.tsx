type statusBlog = "draft" | "published" | "deleted";

export interface BlogType {
  id: string;
  title: string;
  content: string;
  status: statusBlog;
  category_id: string[];
}
