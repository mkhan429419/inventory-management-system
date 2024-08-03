import React, { useEffect, useState } from "react";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  createdAt: any;
};

type ExpenseSums = {
  [category: string]: number;
};

const colors = ["#00C49F", "#0088FE", "#FFBB28"];

const CardExpenseSummary = () => {
  const [expenseByCategorySummary, setExpenseByCategorySummary] = useState<
    Expense[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", user.id),
        where("createdAt", "<=", new Date())
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        setExpenseByCategorySummary(expenses);
        setIsLoading(false);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user]);

  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: Expense) => {
      const category = item.category + " Expenses";
      const amount = item.amount;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category: { value: number }) => acc + category.value,
    0
  );
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Expense Summary
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div className="xl:flex justify-between pr-7">
            {/* CHART */}
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    innerRadius={50}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                <span className="font-bold text-xl">
                  ${formattedTotalExpenses}
                </span>
              </div>
            </div>
            {/* LABELS */}
            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {expenseCategories.map((entry, index) => (
                <li
                  key={`legend-${index}`}
                  className="flex items-center text-xs"
                >
                  <span
                    className="mr-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
          {/* FOOTER */}
          <div>
            <hr />
            <div className="mt-1 flex justify-between items-center px-7 mb-4">
              <div className="pt-2">
                <p className="text-sm">
                  Average:{" "}
                  <span className="font-semibold">
                    ${formattedTotalExpenses}
                  </span>
                </p>
              </div>
              <span className="flex items-center mt-2">
                <TrendingUp className="mr-2 text-green-500" />
                30%
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
