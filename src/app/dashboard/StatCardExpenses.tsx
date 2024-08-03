import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { LucideIcon } from "lucide-react";

type StatDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StatCardProps = {
  title: string;
  primaryIcon: JSX.Element;
  details: StatDetail[];
  dateRange: string;
};

type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  createdAt: Timestamp;
};

const StatCardExpenses = ({ title, primaryIcon, dateRange }: StatCardProps) => {
  const { user } = useUser();
  const [expenseSummary, setExpenseSummary] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.id)
      );

      const unsubscribeExpense = onSnapshot(expenseQuery, (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];
        setExpenseSummary(expenses);
        setIsLoading(false);
      });

      // Clean up the listener on component unmount
      return () => {
        unsubscribeExpense();
      };
    }
  }, [user]);

  const formatPercentage = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed()}%`;
  };

  const getChangeColor = (value: number) =>
    value >= 0 ? "text-green-500" : "text-red-500";

  const totalExpenses = expenseSummary.reduce((acc, curr) => acc + curr.amount, 0);

  const statDetails: StatDetail[] = [
    {
      title: "Total Expenses",
      amount: `$${totalExpenses.toFixed(2)}`,
      changePercentage: 0, // Placeholder value; calculate as needed
      IconComponent: primaryIcon.type,
    },
  ];

  return (
    <div className="md:row-span-1 xl:row-span-2 bg-white col-span-1 shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <div className="flex justify-between items-center mb-2 px-5 pt-4">
              <h2 className="font-semibold text-lg text-gray-700">{title}</h2>
              <span className="text-xs text-gray-400">{dateRange}</span>
            </div>
            <hr />
          </div>

          {/* BODY */}
          <div className="flex mb-6 items-center justify-around gap-4 px-5">
            <div className="rounded-full p-5 bg-blue-50 border-sky-300 border-[1px]">
              {primaryIcon}
            </div>
            <div className="flex-1">
              {statDetails.map((detail, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between my-4">
                    <span className="text-gray-500">{detail.title}</span>
                    <span className="font-bold text-gray-800">{detail.amount}</span>
                    <div className="flex items-center">
                      <detail.IconComponent
                        className={`w-4 h-4 mr-1 ${getChangeColor(
                          detail.changePercentage
                        )}`}
                      />
                      <span
                        className={`font-medium ${getChangeColor(
                          detail.changePercentage
                        )}`}
                      >
                        {formatPercentage(detail.changePercentage)}
                      </span>
                    </div>
                  </div>
                  {index < statDetails.length - 1 && <hr />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatCardExpenses;
