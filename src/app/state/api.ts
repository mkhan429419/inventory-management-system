import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["PantryItems"],
  endpoints: (builder) => ({
    getPantryItems: builder.query({
      query: () => "api/inventory",
      providesTags: ["PantryItems"],
    }),
  }),
});

export const { useGetPantryItemsQuery } = api;
