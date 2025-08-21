import { api } from "@/lib/api";
import { Article, PaginatedArticles } from "@/lib/types";

interface ArticleInput {
  title: string;
  content: string;
  categoryId: string;
}

export const getArticles = async (
  categoryId?: string,
  search = "",
  page = 1,
): Promise<PaginatedArticles> => {
  const res = await api.get<PaginatedArticles>(
    `/articles?category=${categoryId || ""}&search=${search}&page=${page}`,
  );
  return res.data;
};

export const createArticles = async (payload: ArticleInput) => {
  const res = await api.post("/articles", payload);
  return res.data;
};

export const updateArticles = async (id: string, payload: ArticleInput) => {
  const res = await api.put(`/articles/${id}`, payload);
  return res.data;
};
