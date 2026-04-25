export interface ICar {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price_per_day: string | number;
  color: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  available: boolean;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICarRequest {
  name: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price_per_day: number;
  color: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  available: boolean;
  image_url?: string;
}
