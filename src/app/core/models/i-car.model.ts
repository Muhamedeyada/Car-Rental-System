export interface ICar {
  id: number;
  name: string;
  brand: string;
  model: string;
  kilometers: number;
  price_per_day: string | number;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICarRequest {
  name: string;
  brand: string;
  model: string;
  kilometers: number;
  price_per_day: number;
  image_url?: string;
}
