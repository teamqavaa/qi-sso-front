import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cheap local gate: a network round-trip on every navigation is what made
  // page clicks feel slow. Cookie presence is enough here to allow the shell
  // to render; an expired token is caught client-side and sent back to login.
  const cookieStore = await cookies();
  if (!cookieStore.get("access_token")?.value) {
    redirect("/");
  }

  // Hydrate the shared profile server-side so the initial paint shows the
  // user's name instead of the "User" fallback. An expired token returns null
  // and the shell's client-side hydrator sends the user back to login.
  const { user } = await getMeAction();

  return <DashboardShell initialUser={user}>{children}</DashboardShell>;
}
