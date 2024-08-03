"use client";

import { useEffect } from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Trash2 } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";

const Inventory = () => {
  const {
    user,
    isLoaded,
    pantryItems,
    isLoading,
    isError,
    selectedItems,
    setSelectedItems,
    handleDelete,
    processRowUpdate,
  } = useInventory();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200, editable: true },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      editable: true,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
      editable: true,
    },
  ];

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
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={(newSelection) => {
          setSelectedItems(newSelection as GridRowId[]);
        }}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
      {selectedItems.length > 0 && (
        <button
          onClick={handleDelete}
          className="self-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full mt-4 transition duration-200 flex items-center shadow"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Selected
        </button>
      )}
    </div>
  );
};

export default Inventory;
