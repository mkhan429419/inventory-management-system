// src/app/dashboard/CardPopularProducts.tsx
import React, { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface PantryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CardPopularProducts = () => {
  const [popularProducts, setPopularProducts] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pantryItems"), orderBy("quantity", "desc"), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PantryItem[];
      setPopularProducts(items);
      setIsLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Pantry Items
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {popularProducts.length > 0 ? (
              <ul className="p-4 space-y-2">
                {popularProducts.map((product: PantryItem) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                  >
                    <div>img</div>
                    <div className="flex flex-col justify-between gap-1">
                      <div className="font-bold text-gray-700">
                        {product.name}
                      </div>
                      <div className="flex text-sm items-center">
                        <span className="font-bold text-blue-500 text-xs">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p className="m-5">No popular pantry items available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;