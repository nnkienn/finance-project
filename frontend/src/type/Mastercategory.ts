export type MasterCategoryType = "EXPENSE" | "INCOME" | "SAVING";

export interface MasterCategory {
  id: number;
  name: string;
  type: MasterCategoryType;
  icon: string;
}
