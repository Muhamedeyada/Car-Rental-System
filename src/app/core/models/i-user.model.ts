export interface IUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone: string | null;
  country: string | null;
  wallet: string | number | null;
  created_at: string;
  updated_at: string;
}
