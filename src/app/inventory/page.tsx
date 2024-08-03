"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePantryItems } from "@/hooks/usePantryItems";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 110,
    type: "number",
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 110,
    type: "number",
  },
  {
    field: "quantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
];

const Inventory = () => {
  const { user, isLoaded } = useUser();
  const { pantryItems, isLoading, isError } = usePantryItems();

  useEffect(() => {
    console.log(pantryItems);
  }, [pantryItems]);

  if (!isLoaded) {
    return <div className="py-4">Loading user...</div>;
  }

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        rows={pantryItems}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;
