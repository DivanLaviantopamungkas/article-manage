"use client";

import { Category } from "@/lib/types";
import {
  getCategory,
  createCategories,
  updateCategories,
} from "@/services/CategoryService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// === Schema Form ===
const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
});
type CategoryFormData = z.infer<typeof categorySchema>;

// === Custom Hook Debounce (untuk search) ===
function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounce, setDebounce] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounce(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounce;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // state untuk server-side pagination
  const [total, setTotal] = useState(0); // jumlah semua data (dari API)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // search state (debounced biar gak spam API)
  const [searchInput, setSearchInput] = useState("");
  const debouncedQuery = useDebounce(searchInput, 400);

  const router = useRouter();

  // === State Form ===
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);

  // === React Hook Form ===
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // === Fetch data dari API (server-side pagination & search) ===
  const fetchCategories = async (search: string = "", page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategory(search, page);
      console.log("API response:", res); // cek isi res

      setCategories(res.data);
      setTotal(res.totalData);
      setCurrentPage(res.currentPage);
    } catch (err) {
      setError("Gagal Mengambil Data");
    } finally {
      setLoading(false);
    }
  };

  // trigger fetch setiap kali search atau page berubah
  useEffect(() => {
    fetchCategories(debouncedQuery, currentPage);
  }, [debouncedQuery, currentPage]);

  // total halaman = total item dibagi item per page
  const totalPages = Math.ceil(total / itemsPerPage);

  // === Form Submit ===
  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        await updateCategories(selectedCategory.id, data);
        alert("Kategori berhasil diperbarui!");
      } else {
        await createCategories(data);
        alert("Kategori berhasil ditambahkan!");
      }
      reset({ name: "" });
      setShowForm(false);
      setSelectedCategory(null);

      // setelah add/update, refresh data halaman ini
      fetchCategories(debouncedQuery, currentPage);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  // === Handle Add/Edit ===
  const handleAdd = () => {
    reset({ name: "" });
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: Category) => {
    reset({ name: category.name });
    setSelectedCategory(category);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      {/* Header + Search + Tambah */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Daftar Kategori</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1); // ✅ reset ke halaman 1 kalau ada query baru
            }}
            className="w-full rounded-xl border px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 sm:w-64"
          />
          <button
            onClick={handleAdd}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Form Tambah/Edit */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 rounded-xl border bg-gray-50 p-4 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">
            {selectedCategory ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <div className="mb-3">
            <input
              {...register("name")}
              placeholder="Nama kategori"
              className="w-full rounded-lg border px-3 py-2"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting
                ? "Menyimpan..."
                : selectedCategory
                  ? "Update"
                  : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedCategory(null);
              }}
              className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Loading / Error / No Data */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="mb-4 text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">Kategori tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <h2 className="mb-2 text-lg font-semibold transition-colors duration-300 group-hover:text-blue-600">
                {c.name}
              </h2>
              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={() => handleEdit(c)}
                  className="rounded bg-yellow-400 px-3 py-1 text-white transition hover:bg-yellow-500"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchCategories(debouncedQuery, i + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
