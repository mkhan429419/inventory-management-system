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
  userId: string;
  title: string;
  ingredients: { name: string; itemId: string }[];
  instructions: string;
  createdAt: Date;
}

