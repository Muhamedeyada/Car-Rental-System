import { IOrder } from './i-order.model';

export interface IInstallment {
  id: number;
  order_id: number;
  amount: string | number;
  due_date: string;
  status: 'paid' | 'pending' | 'unpaid';
  paid_at: string | null;
  order?: IOrder;
  created_at: string;
  updated_at: string;
}
