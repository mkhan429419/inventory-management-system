import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["PantryItems", "Products", "Recipes", "Purchases", "Expenses"],
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
    // Purchase Endpoints
    getPurchases: builder.query({
      query: () => `api/purchases`,
      providesTags: ["Purchases"],
    }),
    createExpense: builder.mutation({
      query: () => ({
        url: `api/expenses`,
        method: "POST",
      }),
      invalidatesTags: ["Expenses"],
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
  useGetPurchasesQuery,
  useCreateExpenseMutation,
  useGetRecipesQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
} = api;
