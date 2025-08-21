"use client";

import ArticleForm from "../../../../components/ArticleForm";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Buat Artikel Baru</h1>
      <ArticleForm
        onSuccess={() => {
          router.push("/article");
        }}
      />
    </div>
  );
}
