import { ICar } from './i-car.model';
import { IUser } from './i-user.model';
import { IInstallment } from './i-installment.model';

export interface IOrder {
  id: number;
  user_id: number;
  car_id: number;
  user?: IUser;
  car?: ICar;
  delivery_date: string;
  receiving_date: string;
  days: number;
  total_price: string | number;
  points: number;
  payment_type: 'cash' | 'visa' | 'tamara';
  payment_status: 'success' | 'pending' | 'failed';
  order_type: 'full' | 'installments';
  installments?: IInstallment[];
  created_at: string;
  updated_at: string;
}

export interface IOrderRequest {
  car_id: number;
  delivery_date: string;
  receiving_date: string;
  payment_type: 'cash' | 'visa' | 'tamara';
  order_type: 'full' | 'installments';
}
