import React, { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp,
} from "firebase/firestore";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Recipe {
  id: string;
  userId: string;
  title: string;
  ingredients: string[];
  instructions: string;
  createdAt: string; // Adjusted for recharts compatibility
}

const CardRecipesSummary = () => {
  const [recipeData, setRecipeData] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [timeframe, setTimeframe] = useState("weekly");

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "recipes"),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            userId: docData.userId,
            title: docData.title,
            ingredients: docData.ingredients,
            instructions: docData.instructions,
            createdAt: (docData.createdAt as Timestamp).toDate().toISOString().split("T")[0], // Convert timestamp to string
          };
        }) as Recipe[];
        setRecipeData(data);
        setIsLoading(false);
      });

      console.log("Clerk User ID:", user.id);

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user]);

  const totalRecipes = recipeData.length;

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">Recipes Summary</h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Total Recipes</p>
                <span className="text-2xl font-extrabold">{totalRecipes}</span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {/* CHART */}
            <ResponsiveContainer width="100%" height={350} className="px-7">
              <BarChart
                data={recipeData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) => value}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}`]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="title"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="mt-1 flex justify-between items-center px-7 mb-4">
              <p>{recipeData.length || 0} recipes</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardRecipesSummary;
