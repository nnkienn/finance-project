export interface Transaction {
  id?: number; // để optional khi tạo mới
  description: string;
  amount: number;
  date: string;
  type: "EXPENSE" | "INCOME" | "SAVING";
  category: string;
  paymentMethod: string;
}
