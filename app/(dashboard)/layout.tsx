import { redirect } from "next/navigation";
import { getMeAction, clearAuthCookies } from "@/actions/auth";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await getMeAction();

  if (!result.user) {
    await clearAuthCookies();
    // TODO: Add token refresh logic here — call refresh endpoint if access_token is expired
    redirect("/");
  }

  return <DashboardShell initialUser={result.user}>{children}</DashboardShell>;
}
