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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
