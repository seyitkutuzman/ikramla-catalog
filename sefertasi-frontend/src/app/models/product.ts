export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  categoryId?: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  tags: string[];
  discountPercentage?: number;
}