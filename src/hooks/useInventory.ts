import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { PantryItem } from "@/types";
import { GridRowId } from "@mui/x-data-grid";
import { useUpdatePantryItemMutation, useDeletePantryItemMutation } from "@/app/state/api";

export const useInventory = () => {
  const { user, isLoaded } = useUser();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedItems, setSelectedItems] = useState<GridRowId[]>([]);
  const [updatePantryItem] = useUpdatePantryItemMutation();
  const [deletePantryItem] = useDeletePantryItemMutation();

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

  const handleDelete = async () => {
    for (const id of selectedItems) {
      await deletePantryItem(id as string);
    }
    setSelectedItems([]);
  };

  const processRowUpdate = async (newRow: any) => {
    const updatedRow = { ...newRow, isNew: false };
    await updatePantryItem(updatedRow);
    return updatedRow;
  };

  return {
    user,
    isLoaded,
    pantryItems,
    isLoading,
    isError,
    selectedItems,
    setSelectedItems,
    handleDelete,
    processRowUpdate,
  };
};
