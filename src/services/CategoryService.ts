import { api } from "@/lib/api";
import { PaginatedCategories } from "@/lib/types";

interface CategoryInput {
  name: string;
}

export const getCategory = async (
  search: string = "",
  page: number = 1,
): Promise<PaginatedCategories> => {
  const res = await api.get<PaginatedCategories>(
    `/categories?&search=${search}&page=${page}`,
  );
  return res.data;
};

export const createCategories = async (payload: CategoryInput) => {
  const res = await api.post("/categories", payload);
  return res.data;
};

export const updateCategories = async (id: string, payload: CategoryInput) => {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
};
