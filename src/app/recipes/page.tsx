"use client";

import { useState } from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe } from "@/types";
import axios from 'axios';

const Recipes = () => {
  const { recipes, isLoading, isError } = useRecipes();
  const [selectedRecipes, setSelectedRecipes] = useState<GridRowId[]>([]);

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
    },
  ];

  const generateRecipe = async () => {
    const selectedRecipeDetails = selectedRecipes.map((id) => {
      return recipes.find((recipe) => recipe.id === id);
    });

    const ingredients = selectedRecipeDetails.flatMap((recipe) => recipe?.ingredients || []);

    console.log('Selected ingredients:', ingredients);

    try {
      const response = await axios.post('/api/recipes/suggestions', {
        ingredients,
      });
      console.log('Generated Recipe:', response.data);
    } catch (error) {
      console.error('Error generating recipe:', (error as any).response?.data || (error as any).message);
    }
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
      <Header name="Recipes" />
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
          onClick={generateRecipe}
          className="self-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded mt-4 transition duration-200 flex items-center shadow"
        >
          Generate Recipe
        </button>
      )}
    </div>
  );
};

export default Recipes;
