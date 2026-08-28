import { redirect } from "next/navigation";
import { getMeAction, clearAuthCookies } from "@/actions/auth";
import SettingsView from "@/components/dashboard/views/SettingsView";

export default async function SettingsPage() {
  const { user } = await getMeAction();

  if (!user) {
    // Expired token: drop the cookies and return to login instead of a blank shell.
    await clearAuthCookies();
    redirect("/");
  }

  return <SettingsView initialUser={user} />;
}
