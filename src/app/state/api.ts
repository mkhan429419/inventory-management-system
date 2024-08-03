import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/`,
  }),
  reducerPath: "api",
  tagTypes: ["Metrics"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query({
      query: () => "dashboard/metrics",
      providesTags: ["Metrics"],
    }),
  }),
});

export const { useGetDashboardMetricsQuery } = api;
