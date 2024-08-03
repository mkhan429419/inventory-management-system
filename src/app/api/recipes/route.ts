import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

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
