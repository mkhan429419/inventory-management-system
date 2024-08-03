// src/types.ts
import { Timestamp } from "firebase/firestore";

export interface PantryItem {
  id: string;
  userId: string;
  name: string;
  price: number;
  rating: number;
  quantity: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
// src/types.ts
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  userId: string;
  createdAt: Date;
}
