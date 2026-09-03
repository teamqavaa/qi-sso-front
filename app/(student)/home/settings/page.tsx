import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import SettingsView from "@/components/dashboard/views/SettingsView";

export default async function StudentSettingsPage() {
  const { user } = await getMeAction();

  if (!user) {
    redirect("/");
  }

  return <SettingsView initialUser={user} />;
}