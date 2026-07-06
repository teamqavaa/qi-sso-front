"use client";

import { useState } from "react";
import EditableField from "@/components/ui/EditableField";
import { useUser, UserProfile } from "@/components/contexts/UserContext";

// Map UserProfile keys to field keys for EditableField
type FieldKey = keyof UserProfile;

export default function SettingsView() {
  const { user, updateField } = useUser();
  const [isSaving, setIsSaving] = useState<FieldKey | null>(null);

  const fields = [
    { key: "fullName" as FieldKey, label: "Full Name", value: user.fullName },
    { key: "displayName" as FieldKey, label: "Display Name", value: user.displayName },
    { key: "bio" as FieldKey, label: "Bio", value: user.bio },
    { key: "birthDate" as FieldKey, label: "Birth Date", value: user.birthDate, type: "date" },
    { key: "city" as FieldKey, label: "City", value: user.city },
    { key: "country" as FieldKey, label: "Country", value: user.country },
    { key: "language" as FieldKey, label: "Language", value: user.language },
  ];

  async function handleSave(key: FieldKey, val: string) {
    setIsSaving(key);
    try {
      // Mock async save callback
      const mockOnSave = async (field: FieldKey, value: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      };
      await updateField(key, val, mockOnSave);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(null);
    }
  }

  return (
    <div className="px-8 py-10 max-w-2xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>

      {/* Avatar section */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Avatar</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-lg flex-shrink-0">
            {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user.fullName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">@{user.displayName}</p>
          </div>
          <button className="ml-auto text-xs text-[#007bff] border border-[#007bff]/30 px-3 py-1.5 rounded-lg hover:bg-[#007bff]/5 transition-colors">
            Change photo
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-card rounded-xl border border-border px-6">
        {fields.map((field) => (
          <EditableField 
            key={field.key} 
            field={field} 
            onSave={(key, val) => handleSave(key as FieldKey, val)} 
          />
        ))}
      </div>

      {/* Danger zone */}
      <div className="mt-6 bg-card rounded-xl border border-border px-6 py-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account</p>
        <button className="text-sm text-red-500 hover:text-red-600 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  );
}
