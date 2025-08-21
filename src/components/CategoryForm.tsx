"use client";

import { Category } from "@/lib/types";
import { createCategories, updateCategories } from "@/services/CategoryService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type Props = {
  category?: Category;
  onSuccess?: () => void;
};

export default function CategoryForm({ category, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  const watchName = watch("name");

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      if (category) {
        await updateCategories(category.id, data);
        alert("Kategori berhasil diupdate!");
      } else {
        await createCategories(data);
        alert("Kategori berhasil ditambahkan!");
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium">Nama Kategori</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Menyimpan..."
          : category
            ? "Update Kategori"
            : "Tambah Kategori"}
      </button>
    </form>
  );
}
