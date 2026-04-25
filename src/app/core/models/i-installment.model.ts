export interface IInstallment {
  id: number;
  order_id: number;
  amount: string | number;
  due_date: string;
  status: 'paid' | 'unpaid';
  created_at: string;
  updated_at: string;
}
