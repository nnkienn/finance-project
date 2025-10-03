export interface Transaction {
  id?: number; 
  note: string; 
  amount: number;
  transactionDate: string; // 
  type: "EXPENSE" | "INCOME" | "SAVING";
  paymentMethod: "CASH" | "BANK" | "CARD";
  userCategoryId: number; 
}
