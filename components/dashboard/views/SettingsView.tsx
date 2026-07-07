"use client";

import EditableField from "@/components/EditableField";
import { useUser } from "@/context/UserContext";
import { updateProfileAction } from "@/actions/auth";

type EditableFields = "full_name" | "display_name" | "bio" | "birth_date" | "city" | "country" | "language";

export default function SettingsView() {
  const { user, updateUser } = useUser();

  if (!user) {
    return (
      <div className="px-8 py-10 max-w-2xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const fields: { key: EditableFields; label: string; value: string | null }[] = [
    { key: "full_name", label: "Full Name", value: user.full_name },
    { key: "display_name", label: "Display Name", value: user.display_name },
    { key: "bio", label: "Bio", value: user.bio },
    { key: "birth_date", label: "Birth Date", value: user.birth_date },
    { key: "city", label: "City", value: user.city },
    { key: "country", label: "Country", value: user.country },
    { key: "language", label: "Language", value: user.language },
  ];

  function handleSave(field: EditableFields) {
    return async (newValue: string) => {
      const result = await updateProfileAction(field, newValue);
      if (result.ok) {
        updateUser({ [field]: newValue });
      }
      return result;
    };
  }

  return (
    <div className="px-8 py-10 max-w-2xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Avatar</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#007bff]/10 flex items-center justify-center text-[#007bff] font-semibold text-lg flex-shrink-0">
            {(user.display_name || user.full_name || "User")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user.full_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">@{user.display_name}</p>
          </div>
          <button className="ml-auto text-xs text-[#007bff] border border-[#007bff]/30 px-3 py-1.5 rounded-lg hover:bg-[#007bff]/5 transition-colors">
            Change photo
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border px-6">
        {fields.map(({ key, label, value }) => (
          <EditableField key={key} label={label} value={value} onSave={handleSave(key)} />
        ))}
      </div>

      <div className="mt-6 bg-card rounded-xl border border-border px-6 py-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account</p>
        <button className="text-sm text-red-500 hover:text-red-600 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  );
}
