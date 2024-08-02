// src/app/api/dashboard/metrics/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../config/firebaseConfig";
import { collection, getDocs, orderBy, limit, query, where, Timestamp } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";

interface PantryItem {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  rating: number;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Summary {
  id: string;
  totalValue: number;
  changePercentage?: number;
  date: Timestamp;
}

interface ExpenseByCategory {
  id: string;
  expenseSummaryId: string;
  category: string;
  amount: number;
  date: Timestamp;
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Clerk User ID:", userId);

    const metrics = {
      popularPantryItems: [] as PantryItem[],
      salesSummary: [] as Summary[],
      purchaseSummary: [] as Summary[],
      expenseSummary: [] as Summary[],
      expenseByCategorySummary: [] as ExpenseByCategory[],
    };

    // Real-time listener for popular pantry items
    const pantryItemsQuery = query(
      collection(db, "pantryItems"),
      where("userId", "==", userId),
      orderBy("quantity", "desc"),
      limit(15)
    );
    const pantryItemsSnapshot = await getDocs(pantryItemsQuery);
    metrics.popularPantryItems = pantryItemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PantryItem[];

    // Real-time listener for sales summary
    const salesSummaryQuery = query(
      collection(db, "salesSummary"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(5)
    );
    const salesSummarySnapshot = await getDocs(salesSummaryQuery);
    metrics.salesSummary = salesSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Real-time listener for purchase summary
    const purchaseSummaryQuery = query(
      collection(db, "purchaseSummary"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(5)
    );
    const purchaseSummarySnapshot = await getDocs(purchaseSummaryQuery);
    metrics.purchaseSummary = purchaseSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Real-time listener for expense summary
    const expenseSummaryQuery = query(
      collection(db, "expenseSummary"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(5)
    );
    const expenseSummarySnapshot = await getDocs(expenseSummaryQuery);
    metrics.expenseSummary = expenseSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Real-time listener for expense by category summary
    const expenseByCategorySummaryQuery = query(
      collection(db, "expenseByCategory"),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(5)
    );
    const expenseByCategorySummarySnapshot = await getDocs(expenseByCategorySummaryQuery);
    metrics.expenseByCategorySummary = expenseByCategorySummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExpenseByCategory[];

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error retrieving dashboard metrics:", error);
    return NextResponse.json({ message: "Error retrieving dashboard metrics" }, { status: 500 });
  }
}
