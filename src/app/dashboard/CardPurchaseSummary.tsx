import React, { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Purchase {
  id: string;
  pantryItemId: string;
  userId: string;
  createdAt: any;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

const CardPurchaseSummary = () => {
  const [purchaseData, setPurchaseData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "purchases"),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const purchases = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Purchase[];
        setPurchaseData(purchases);
        setIsLoading(false);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user]);

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Purchase Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">Purchased</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {lastDataPoint
                    ? numeral(lastDataPoint.totalCost).format("$0.00a")
                    : "0"}
                </p>
                {lastDataPoint && (
                  <p
                    className={`text-sm ${
                      lastDataPoint.totalCost! >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    } flex ml-3`}
                  >
                    {lastDataPoint.totalCost! >= 0 ? (
                      <TrendingUp className="w-5 h-5 mr-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-1" />
                    )}
                    {Math.abs(lastDataPoint.totalCost!)}%
                  </p>
                )}
              </div>
            </div>
            {/* CHART */}
            <ResponsiveContainer width="100%" height={150} className="p-2">
              <AreaChart
                data={purchaseData}
                margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
              >
                <XAxis dataKey="createdAt" tick={false} axisLine={false} />
                <YAxis tickLine={false} tick={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("en")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  type="linear"
                  dataKey="totalCost"
                  stroke="#8884d8"
                  fill="#8884d8"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPurchaseSummary;
