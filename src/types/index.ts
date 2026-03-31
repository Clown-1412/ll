export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  material?: string;
  category?: {
    id: number;
  };
}