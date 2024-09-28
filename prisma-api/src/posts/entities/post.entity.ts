import { Post } from "@prisma/client";

export class PostEntity implements Post {
  id: number;
  published: boolean;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  author_id: number;
}
