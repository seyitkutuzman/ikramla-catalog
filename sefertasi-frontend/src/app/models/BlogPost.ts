// src/app/models/blog-post.ts
export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    category: string; // Yeni eklenen kategori alanı
}
