// src/type/UserCategory.ts
export interface UserCategory {
  id: number;
  name: string;
  icon?: string;
  masterCategoryId: number;
  masterCategoryName: string;
  masterCategoryType: "EXPENSE" | "INCOME" | "SAVING";
}
