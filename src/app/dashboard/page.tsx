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
import StatCardPurchases from "./StatCardPurchases";
import StatCardExpenses from "./StatCardExpenses";
import StatCardRecipes from "./StatCardRecipes";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <StatCardPurchases
        title="Purchases"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="Last 30 days"
        details={[]} // details are managed within the StatCard
      />
      <StatCardExpenses
        title="Expenses"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="Last 30 days"
        details={[]} // details are managed within the StatCard
      />
      <StatCardRecipes
        title="Recipes"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="Last 30 days"
        details={[]} // details are managed within the StatCard
      />
    </div>
  );
};

export default Dashboard;
