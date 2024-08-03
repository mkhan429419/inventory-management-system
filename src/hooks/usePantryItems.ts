// src/hooks/usePantryItems.ts
import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { PantryItem } from "@/types";

export const usePantryItems = () => {
  const { user, isLoaded } = useUser();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const q = query(collection(db, "pantryItems"), where("userId", "==", user.id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items: PantryItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PantryItem[];
        setPantryItems(items);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.error("Error fetching pantry items:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [isLoaded, user]);

  return { pantryItems, isLoading, isError };
};
