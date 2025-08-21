"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArticles } from "@/services/ArticleService";
import type { Article } from "@/lib/types";

export default function ArticleDetail() {
  const { id } = useParams(); // ambil id dari route /article/[id]
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await getArticles(); // fetch semua artikel
        const found = res.data.find((a) => a.id === id);
        setArticle(found || null);

        if (found) {
          const others = res.data
            .filter(
              (a) => a.id !== found.id && a.categoryId === found.categoryId,
            )
            .slice(0, 3);
          setOtherArticles(others);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Artikel tidak ditemukan.</p>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Judul */}
      <h1 className="mb-3 text-3xl font-bold text-gray-900">{article.title}</h1>

      {/* Meta info */}
      <div className="mb-6 flex flex-col text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{article.category?.name ?? "Tanpa Kategori"}</span>
        <span>Oleh {article.user?.username ?? "Anon"}</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Konten */}
      <div className="prose prose-slate mb-8 max-w-none">{article.content}</div>

      {/* Artikel lain */}
      {otherArticles.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Artikel lain dari kategori ini
          </h2>
          <ul className="space-y-2">
            {otherArticles.map((a) => (
              <li key={a.id}>
                <a
                  href={`/article/${a.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
