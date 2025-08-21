import { getCategory } from "@/services/CategoryService";

export type Paginated<T> = {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

export type User = {
  id: string;
  username: string;
  role: string;
};

export type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  category?: Category;
  user?: User;
  createdAt: string;
  updatedAt?: string;
};

export type PaginatedArticles = {
  data: Article[];
  total: number;
  page: number;
  limit: number;
};

export type PaginatedCategories = {
  data: Category[];
  totalData: number;
  currentPage: number;
  totalPages: number;
};

export type AuthResponse = {
  token: string;
  user: {
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type RegisterResponse = {
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};
