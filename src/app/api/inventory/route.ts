import { NextResponse } from "next/server";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const q = query(collection(db, "pantryItems"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const pantryItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(pantryItems);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    return NextResponse.json({ message: "Error fetching pantry items" }, { status: 500 });
  }
}
