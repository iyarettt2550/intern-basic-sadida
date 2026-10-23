export interface Product {
  proId: string;
  proName: string;
  description: string;
  categoryName: 'รองเท้าวิ่ง' | 'รองเท้าเดิน' | string;
  categoryId: 'cg_1' | 'cg_2' | string;
  price: number;
  prodetailSize: string;
  sizes: string[];
  imageUrl: string;
  badge?: string;
  isPopular?: boolean;
}

export type CategoryFilter = 'all' | 'รองเท้าวิ่ง' | 'รองเท้าเดิน';

export interface GridSectionConfig {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}
