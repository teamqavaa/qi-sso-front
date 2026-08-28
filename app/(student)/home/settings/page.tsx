import { Separator } from "@/components/ui/separator";
import PageBreadcrumbs from "@/components/dashboard/PageBreadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// TODO: Replace the mock profile and preference values with the settings
// endpoints once they exist. Every field below is placeholder data.
const MOCK_PROFILE = {
  displayName: "Amina Diallo",
  email: "amina.diallo@example.com",
  country: "Senegal",
  language: "English",
};

const MOCK_PREFERENCES = [
  { label: "Weekly goal", value: "5 hours" },
  { label: "Email reminders", value: "On" },
  { label: "Public profile", value: "Off" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <PageBreadcrumbs
        className="mb-6"
        items={[{ label: "Settings", href: "/home/settings" }]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your profile and learning preferences.
      </p>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Profile
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            Display name
            <Input defaultValue={MOCK_PROFILE.displayName} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <Input defaultValue={MOCK_PROFILE.email} type="email" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Country
            <Input defaultValue={MOCK_PROFILE.country} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Language
            <Input defaultValue={MOCK_PROFILE.language} />
          </label>
        </div>
      </section>

      <Separator className="mt-8" />

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Preferences
        </h2>
        <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-white">
          {MOCK_PREFERENCES.map((preference) => (
            <div
              key={preference.label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-foreground">{preference.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {preference.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex gap-2">
        <Button className="rounded-full">Save changes</Button>
        <Button variant="outline" className="rounded-full">
          Cancel
        </Button>
      </div>
    </div>
  );
}