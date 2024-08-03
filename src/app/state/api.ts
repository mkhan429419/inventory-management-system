import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["PantryItems", "Recipes"],
  endpoints: (builder) => ({
    // Pantry Items Endpoints
    getPantryItems: builder.query({
      query: () => `api/inventory`,
      providesTags: ["PantryItems"],
    }),
    createPantryItem: builder.mutation({
      query: (newItem) => ({
        url: `api/inventory`,
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["PantryItems"],
    }),
    updatePantryItem: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `api/inventory/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["PantryItems"],
    }),
    deletePantryItem: builder.mutation({
      query: (id) => ({
        url: `api/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PantryItems"],
    }),
    // Recipe Endpoints
    getRecipes: builder.query({
      query: () => `api/recipes`,
      providesTags: ["Recipes"],
    }),
  }),
});

export const { 
  useGetPantryItemsQuery, 
  useCreatePantryItemMutation, 
  useUpdatePantryItemMutation, 
  useDeletePantryItemMutation,
  useGetRecipesQuery 
} = api;
