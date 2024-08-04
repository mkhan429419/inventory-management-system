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

export type Purchase = {
  id: string;
  userId: string;
  pantryItemId: string;
  createdAt: Date;
  quantity: number;
  unitCost: number;
  totalCost: number;
};

export type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  createdAt: Date;
};