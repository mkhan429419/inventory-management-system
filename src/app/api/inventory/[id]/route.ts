import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent } from "next/server";

interface Context {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, context: Context) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;
    const { name, price, rating, quantity, imageUrl } = await req.json();

    const pantryItemRef = doc(db, "pantryItems", id);
    await updateDoc(pantryItemRef, {
      name,
      price,
      rating,
      quantity,
      imageUrl,
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Pantry item updated successfully" });
  } catch (error) {
    console.error("Error updating pantry item:", error);
    return NextResponse.json({ message: "Error updating pantry item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;

    const pantryItemRef = doc(db, "pantryItems", id);
    await deleteDoc(pantryItemRef);

    return NextResponse.json({ message: "Pantry item deleted successfully" });
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    return NextResponse.json({ message: "Error deleting pantry item" }, { status: 500 });
  }
}
