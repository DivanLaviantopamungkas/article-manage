"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getArticles } from "@/services/ArticleService";
import { api } from "@/lib/api";
import type { Article, Category } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hook debounce sederhana
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const debouncedQuery = useDebouncedValue(searchInput, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const userRole = JSON.parse(localStorage.getItem("user") || "{}")?.role;
  const router = useRouter();

  // Fetch articles dari API
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getArticles();
      setArticles(res.data);
    } catch (err) {
      setError("Gagal mengambil data, menggunakan dummy data.");
      import("@/data/backup.json").then((backup) => {
        setArticles(backup.articles || []);
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories dari API
  const fetchCategories = async () => {
    try {
      const res = await api.get<{ data: Category[] }>("/categories");
      setCategories(res.data.data);
    } catch {
      import("@/data/backup.json").then((backup) => {
        setCategories(backup.categories || []);
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, []);

  // Filter + Search
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.categoryId === categoryFilter);
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((a) => {
        const inTitle = a.title.toLowerCase().includes(q);
        const inContent = a.content.toLowerCase().includes(q);
        return inTitle || inContent;
      });
    }

    return result;
  }, [articles, categoryFilter, debouncedQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  //Fungsi Handle Edit
  const handleEdit = (article: Article) => {
    router.push(`/article/edit/${article.id}`);
  };

  return (
    <div className="p-6">
      {/* Header + Tombol Buat Artikel */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Daftar Artikel</h1>
        {userRole === "Admin" && (
          <button
            onClick={() => router.push("/article/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Buat Artikel Baru
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <select
          className="flex-1 rounded-md border px-4 py-2"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value === "all" ? "all" : e.target.value)
          }
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cari artikel..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 rounded-md border px-4 py-2"
        />
      </div>

      {/* Loading / Error / No Data */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="mb-4 text-red-500">{error}</p>
      ) : paginatedArticles.length === 0 ? (
        <p className="text-gray-500">Tidak ada artikel ditemukan.</p>
      ) : (
        /* Grid Artikel */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedArticles.map((a) => (
            <div
              key={a.id}
              className="group rounded-lg border p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Link href={`/article/${a.id}`} className="block">
                <h2 className="mb-2 text-lg font-semibold">{a.title}</h2>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {a.content}
                </p>
                <span className="mt-2 block text-xs text-gray-400">
                  {a.category?.name ?? "Tanpa Kategori"} •{" "}
                  {a.user?.username ?? "Anon"}
                </span>
              </Link>

              {/* Tombol Edit hanya untuk admin */}
              {userRole === "Admin" && (
                <button
                  onClick={() => handleEdit(a)}
                  className="mt-2 rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-lg px-4 py-2 ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
