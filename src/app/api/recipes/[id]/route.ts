// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const recipeRef = doc(db, "recipes", id);

    await deleteDoc(recipeRef);

    return new NextResponse(JSON.stringify({ message: "Recipe deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error deleting recipe",
        details: (error as any).response?.data || (error as any).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
