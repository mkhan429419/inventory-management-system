// src/hooks/useRecipes.ts
import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { Recipe } from "@/types";
import { useDeleteRecipeMutation } from "@/app/state/api";

export const useRecipes = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [deleteRecipe] = useDeleteRecipeMutation();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const q = query(collection(db, "recipes"), where("userId", "==", user.id));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items: Recipe[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setRecipes(items);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.error("Error fetching recipes:", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [isLoaded, user]);

  return {
    recipes,
    isLoading,
    isError,
    deleteRecipe,
  };
};
