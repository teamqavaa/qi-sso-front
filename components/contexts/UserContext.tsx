"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define TypeScript types for user profile
export type UserProfile = {
  fullName: string;
  displayName: string;
  avatar: string;
  bio: string;
  birthDate: string;
  city: string;
  country: string;
  language: string;
};

// Define the context type
type UserContextType = {
  user: UserProfile;
  updateField: (field: keyof UserProfile, value: string, onSave: (field: keyof UserProfile, value: string) => Promise<void>) => Promise<void>;
};

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ 
  initialUser, 
  children 
}: { 
  initialUser: UserProfile; 
  children: ReactNode; 
}) {
  const [user, setUser] = useState<UserProfile>(initialUser);

  const updateField = async (
    field: keyof UserProfile, 
    value: string, 
    onSave: (field: keyof UserProfile, value: string) => Promise<void>
  ) => {
    try {
      // Call the async onSave callback first
      await onSave(field, value);
      // Update context only on success
      setUser(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      // Re-throw the error so the caller can handle it
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, updateField }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
