"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleForm from "../../../../../components/ArticleForm";
import { getArticles } from "@/services/ArticleService";
import type { Article } from "@/lib/types";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await getArticles(); // fetch semua artikel
        const found = res.data.find((a) => a.id === id) || null;
        setArticle(found);
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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit Artikel</h1>
      <ArticleForm
        article={article}
        onSuccess={() => router.push("/article")}
      />
    </div>
  );
}
