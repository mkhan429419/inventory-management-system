import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { Purchase } from "@/types";
import { useCreateExpenseMutation } from "@/app/state/api";

export const usePurchases = () => {
  const { user, isLoaded } = useUser();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [createExpense] = useCreateExpenseMutation();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const q = query(collection(db, "purchases"), where("userId", "==", user.id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items: Purchase[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Purchase[];
        setPurchases(items);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.error("Error fetching purchases:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [isLoaded, user]);

  const handleCreateExpense = async () => {
    if (!user) return;

    const purchasesForUser = purchases.filter(purchase => purchase.userId === user.id);
    const totalAmount = purchasesForUser.reduce((acc, purchase) => acc + purchase.totalCost, 0);

    const newExpense = {
      userId: user.id,
      category: "Daily Purchases",
      amount: totalAmount,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "expenses"), newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  return {
    purchases,
    isLoading,
    isError,
    handleCreateExpense,
  };
};
