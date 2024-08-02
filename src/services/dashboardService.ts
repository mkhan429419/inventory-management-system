// src/services/dashboardService.ts
export const getDashboardMetrics = async () => {
  const response = await fetch('/api/dashboard/metrics');
  return response.json();
};
