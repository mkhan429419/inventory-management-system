import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { category, amount } = await request.json();

    const newExpense = {
      userId,
      category,
      amount,
      createdAt: new Date(),
    };

    await addDoc(collection(db, "expenses"), newExpense);

    return NextResponse.json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json({ message: "Error adding expense" }, { status: 500 });
  }
}
