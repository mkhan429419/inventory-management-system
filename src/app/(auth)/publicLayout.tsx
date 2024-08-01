// src/app/(auth)/publicLayout.tsx
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-center min-h-screen">{children}</div>;
};

export default PublicLayout;
