import { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { PantryItem } from "@/types";
import { useCreateProductMutation } from "@/app/state/api";

export const useProducts = () => {
  const { user, isLoaded } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<PantryItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [createProduct] = useCreateProductMutation();

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
        setProducts(items);
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

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreateProduct = async (productData: Omit<PantryItem, "id" | "userId" | "createdAt" | "updatedAt">) => {
    await createProduct(productData);
  };

  return {
    products: filteredProducts,
    isLoading,
    isError,
    handleSearch,
    handleCreateProduct,
    searchTerm,
  };
};
