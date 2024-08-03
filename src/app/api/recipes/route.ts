import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, ingredients, instructions } = await req.json();
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const newRecipe = {
      title,
      ingredients,
      instructions,
      userId,
      createdAt: new Date(),
    };

    const recipeRef = await addDoc(collection(db, "recipes"), newRecipe);

    return new NextResponse(JSON.stringify({ id: recipeRef.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Error creating recipe:",
      (error as any).response?.data || (error as any).message
    );
    return new NextResponse(
      JSON.stringify({
        message: "Error creating recipe",
        details: (error as any).response?.data || (error as any).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const q = query(collection(db, "recipes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
  }
}
