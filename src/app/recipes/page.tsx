// src/app/recipes/page.tsx
"use client";

import { useState } from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe } from "@/types";
import axios from "axios";
import CreateRecipeModal from "./CreateRecipeModal";
import ViewRecipeModal from "./ViewRecipeModal";
import { PlusCircleIcon, Trash2 } from "lucide-react";

const Recipes = () => {
  const { recipes, isLoading, isError, deleteRecipe } = useRecipes();
  const [selectedRecipes, setSelectedRecipes] = useState<GridRowId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "ingredients",
      headerName: "Ingredients",
      width: 300,
      renderCell: (params) => (
        <div>
          {params.row.ingredients.map((ingredient: string, index: number) => (
            <span key={index}>
              {ingredient}
              {index < params.row.ingredients.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "instructions",
      headerName: "Instructions",
      width: 300,
      renderCell: (params) => (
        <div>
          {params.row.instructions.length > 100
            ? `${params.row.instructions.substring(0, 100)}...`
            : params.row.instructions}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => {
            setSelectedRecipe(params.row);
            setViewModalOpen(true);
          }}
          className="text-blue-500"
        >
          Read More
        </button>
      ),
    },
  ];

  const generateRecipe = async (ingredients: string[]) => {
    console.log("Selected ingredients:", ingredients);

    try {
      const response = await axios.post("/api/recipes/suggestions", {
        ingredients,
      });

      console.log("API Response:", response.data);

      const instructions = response.data.instructions;
      const title = response.data.title || "Untitled Recipe";
      console.log("Generated Recipe Title:", title);
      console.log("Generated Recipe Instructions:", instructions);

      // Now create the recipe in your database
      await axios.post("/api/recipes", {
        title,
        ingredients,
        instructions,
      });
    } catch (error) {
      console.error(
        "Error generating recipe:",
        (error as any).response?.data || (error as any).message
      );
    }
  };

  const handleDelete = async () => {
    for (const id of selectedRecipes) {
      await deleteRecipe(id as string);
    }
    setSelectedRecipes([]);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch recipes
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <Header name="Recipes" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
          Create Recipe
        </button>
      </div>
      <DataGrid
        rows={recipes}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRecipes(newSelection as GridRowId[]);
        }}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
      {selectedRecipes.length > 0 && (
        <button
          onClick={handleDelete}
          className="self-center bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded mt-4 transition duration-200 flex items-center shadow"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Selected
        </button>
      )}
      <CreateRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={generateRecipe}
      />
      <ViewRecipeModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default Recipes;
