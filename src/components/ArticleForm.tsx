"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Article, Category } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createArticles } from "@/services/ArticleService";

const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Isi artikel minimal 10 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

type Props = {
  article?: Article;
  onSuccess?: () => void;
};

export default function ArticleForm({ article, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [preview, setPreview] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      content: article?.content || "",
      categoryId: article?.categoryId || "",
    },
  });

  const watchTitle = watch("title");
  const watchContent = watch("content");
  const watchCategoryId = watch("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<{ data: Category[] }>("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Gagal fetch kategori", err);
        setErrorMsg("Gagal memuat kategori");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    };
    fetchCategories();
  }, []);

  const handlePreview = () => {
    const selectedCategory = categories.find((c) => c.id === watchCategoryId);
    setPreview({
      id: article?.id || "preview",
      title: watchTitle,
      content: watchContent,
      categoryId: watchCategoryId,
      category: selectedCategory,
      userId: "preview",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const onSubmit = async (data: ArticleFormData) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await createArticles(data);
      console.log("Respon backend:", res);

      // Hentikan loading dulu
      setLoading(false);

      // Tampilkan success toast 3 detik
      setSuccessMsg("Artikel berhasil dibuat!");
      setTimeout(() => setSuccessMsg(null), 3000);

      onSuccess?.(); // refresh list
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);

      // Tampilkan error toast 3 detik
      setErrorMsg("Gagal submit artikel");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  return (
    <div className="relative space-y-6 p-6">
      {/* Toast Messages */}
      {loading && (
        <div className="fixed right-5 top-5 z-50 rounded bg-blue-500 px-4 py-2 text-white shadow-md">
          Menyimpan...
        </div>
      )}
      {successMsg && (
        <div className="fixed right-5 top-5 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-md">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed right-5 top-5 z-50 rounded bg-red-500 px-4 py-2 text-white shadow-md">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Judul Artikel"
            className="w-full rounded-md border px-3 py-2"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Isi Artikel"
            className="min-h-[150px] w-full rounded-md border px-3 py-2"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div>
          <select
            className="w-full rounded-md border px-3 py-2"
            {...register("categoryId")}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePreview}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Preview
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {article ? "Update Artikel" : "Buat Artikel"}
          </button>
        </div>
      </form>

      {/* Preview */}
      {preview && (
        <div className="mt-6 rounded border bg-gray-50 p-4">
          <h2 className="mb-2 text-lg font-bold">{preview.title}</h2>
          <span className="mb-2 block text-sm text-gray-500">
            {preview.category?.name ?? "Tanpa Kategori"}
          </span>
          <p>{preview.content}</p>
        </div>
      )}
    </div>
  );
}
