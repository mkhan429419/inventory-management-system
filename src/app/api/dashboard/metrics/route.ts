// src/app/api/dashboard/metrics/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../config/firebaseConfig';
import { collection, getDocs, orderBy, limit, query, Timestamp } from 'firebase/firestore';

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

export async function GET() {
  try {
    // Fetch popular pantry items
    const pantryItemsQuery = query(
      collection(db, 'pantryItems'),
      orderBy('quantity', 'desc'),
      limit(15)
    );
    const pantryItemsSnapshot = await getDocs(pantryItemsQuery);
    const popularPantryItems = pantryItemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PantryItem[];

    // Fetch sales summary
    const salesSummaryQuery = query(
      collection(db, 'salesSummary'),
      orderBy('date', 'desc'),
      limit(5)
    );
    const salesSummarySnapshot = await getDocs(salesSummaryQuery);
    const salesSummary = salesSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Fetch purchase summary
    const purchaseSummaryQuery = query(
      collection(db, 'purchaseSummary'),
      orderBy('date', 'desc'),
      limit(5)
    );
    const purchaseSummarySnapshot = await getDocs(purchaseSummaryQuery);
    const purchaseSummary = purchaseSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Fetch expense summary
    const expenseSummaryQuery = query(
      collection(db, 'expenseSummary'),
      orderBy('date', 'desc'),
      limit(5)
    );
    const expenseSummarySnapshot = await getDocs(expenseSummaryQuery);
    const expenseSummary = expenseSummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Summary[];

    // Fetch expense by category summary
    const expenseByCategorySummaryQuery = query(
      collection(db, 'expenseByCategory'),
      orderBy('date', 'desc'),
      limit(5)
    );
    const expenseByCategorySummarySnapshot = await getDocs(expenseByCategorySummaryQuery);
    const expenseByCategorySummaryRaw = expenseByCategorySummarySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExpenseByCategory[];

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
      ...item,
      amount: item.amount.toString(),
    }));

    return NextResponse.json({
      popularPantryItems,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    console.error('Error retrieving dashboard metrics:', error);
    return NextResponse.json({ message: 'Error retrieving dashboard metrics' }, { status: 500 });
  }
}
