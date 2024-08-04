import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { PantryItem } from "@/types";

export async function GET(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm") || "";

    const q = query(collection(db, "pantryItems"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    let pantryItems: PantryItem[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PantryItem, "id">),
    }));

    if (searchTerm) {
      pantryItems = pantryItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return NextResponse.json(pantryItems);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    return NextResponse.json({ message: "Error fetching pantry items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, price, rating, quantity, imageUrl } = await request.json();

    const newPantryItem: Omit<PantryItem, "id"> = {
      userId,
      name,
      price,
      rating,
      quantity,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pantryItemRef = await addDoc(collection(db, "pantryItems"), newPantryItem);

    const newPurchase = {
      userId,
      pantryItemId: pantryItemRef.id,
      createdAt: Timestamp.now(),
      quantity,
      unitCost: price,
      totalCost: price * quantity,
    };

    await addDoc(collection(db, "purchases"), newPurchase);

    // Determine the category based on the total cost
    const totalCost = price * quantity;
    let category = "Basic Necessities";
    if (totalCost > 150) {
      category = "Premium Purchases";
    } else if (totalCost > 50) {
      category = "Monthly Bulk Purchase";
    } else if (totalCost > 10) {
      category = "Weekly Stock-up";
    }

    // Create an expense for the new purchase
    const newExpense = {
      userId,
      category,
      amount: totalCost,
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, "expenses"), newExpense);

    return NextResponse.json({ message: "Pantry item, purchase, and expense added successfully" });
  } catch (error) {
    console.error("Error adding pantry item:", error);
    return NextResponse.json({ message: "Error adding pantry item" }, { status: 500 });
  }
}
