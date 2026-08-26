export type TransactionType = 'INCOME' | 'EXPENSE';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';

// Expense categories
export type ExpenseCategory = 
  | 'FOOD' 
  | 'TRANSPORT' 
  | 'EDUCATION' 
  | 'SHOPPING' 
  | 'BILLS' 
  | 'ENTERTAINMENT' 
  | 'HEALTHCARE' 
  | 'TRAVEL' 
  | 'OTHER';

// Income categories
export type IncomeCategory = 
  | 'SALARY' 
  | 'FREELANCE' 
  | 'BUSINESS' 
  | 'SCHOLARSHIP' 
  | 'GIFT' 
  | 'OTHER';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string | null;
  transactionDate: string; // ISO format (YYYY-MM-DD)
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
}

export type UpdateTransactionRequest = CreateTransactionRequest;

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySummary {
  category: TransactionCategory;
  amount: number;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
}
