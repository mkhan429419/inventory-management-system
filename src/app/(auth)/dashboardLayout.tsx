// src/app/(auth)/dashboardLayout.tsx
"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "../redux";
import { useUser } from "@clerk/nextjs";
import { db } from '@/config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollaspsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const addPantryItem = async (userId: string) => {
    try {
      const pantryItemRef = collection(db, "pantryItems");
      await addDoc(pantryItemRef, {
        userId: userId,
        itemId: "1",
        name: "Sample Item",
        quantity: 1,
        imageUrl: "1",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Pantry item added for user:", userId);
    } catch (error) {
      console.error("Error adding pantry item to Firestore:", error);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }

    const handleUserInFirestore = async () => {
      if (isLoaded && user) {
        console.log("User object:", user); // Log the user object

        try {
          await addPantryItem(user.id);
        } catch (error) {
          console.error("Error adding pantry item to Firestore:", error);
        }
      }
    };

    handleUserInFirestore();
  }, [isDarkMode, isLoaded, user]);

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
