import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://stocksmart.vercel.app" }),
  reducerPath: "api",
  tagTypes: ["PantryItems", "Products", "Recipes"],
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
    // Product Endpoints
    getProducts: builder.query({
      query: () => `api/products`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: `api/products`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `api/products/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    // Recipe Endpoints
    getRecipes: builder.query({
      query: () => `api/recipes`,
      providesTags: ["Recipes"],
    }),
    createRecipe: builder.mutation({
      query: (newRecipe) => ({
        url: `api/recipes`,
        method: "POST",
        body: newRecipe,
      }),
      invalidatesTags: ["Recipes"],
    }),
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `api/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipes"],
    }),
  }),
});

export const {
  useGetPantryItemsQuery,
  useCreatePantryItemMutation,
  useUpdatePantryItemMutation,
  useDeletePantryItemMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetRecipesQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
} = api;
