export interface CategoryDocument {
  id: string;
  name_en: string;
  name_vi: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
  color: string;
  jlptLevel: string;
  vocabulary_count: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
