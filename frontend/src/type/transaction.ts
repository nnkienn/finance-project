export interface Transaction {
  id?: number;
  note: string;
  amount: number;
  transactionDate: string;
  type: "EXPENSE" | "INCOME" | "SAVING";
  paymentMethod?: "CASH" | "BANK" | "CARD";
  userCategoryId?: number | null; // optional now
  savingGoalId?: number | null;   // optional
  // optional response fields from BE:
  categoryName?: string | null;
  categoryIcon?: string | null;
  savingGoalName?: string | null;
}
