export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
  follower_count?: number;
  following_count?: number;
  post_count?: number;
}

export interface Author {
  username: string;
  display_name: string;
  avatar_url: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: EditorContent;
  cover_image_url: string;
  published: boolean;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
  author: Author;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
}

export interface EditorContent {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
}

export interface EditorBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface Comment {
  id: string;
  body: string;
  created_at: string;
  user: Author;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}
