"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const { user } = useUser();
  const [customerGrowth, setCustomerGrowth] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [dues, setDues] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [sales, setSales] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const expenseQuery = query(
        collection(db, "expenses"),
        where("userId", "==", user.id)
      );
      const salesQuery = query(
        collection(db, "purchases"),
        where("userId", "==", user.id)
      );

      const unsubscribeExpense = onSnapshot(expenseQuery, (snapshot) => {
        const totalExpenses = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + (data.amount || 0);
        }, 0);
        setExpenses(totalExpenses);
      });

      const unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
        const totalSales = snapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + (data.totalCost || 0);
        }, 0);
        setSales(totalSales);
      });

      // Add more queries and listeners as needed for dues, pending orders, etc.

      // Clean up the listeners on component unmount
      return () => {
        unsubscribeExpense();
        unsubscribeSales();
        // Unsubscribe other listeners
      };
    }
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: customerGrowth.toFixed(2),
            changePercentage: 131, // Calculate as needed
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: expenses.toFixed(2),
            changePercentage: -56, // Calculate as needed
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: dues.toFixed(2),
            changePercentage: 131, // Calculate as needed
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: pendingOrders.toFixed(2),
            changePercentage: -56, // Calculate as needed
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: sales.toFixed(2),
            changePercentage: 20, // Calculate as needed
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: discount.toFixed(2),
            changePercentage: -10, // Calculate as needed
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
