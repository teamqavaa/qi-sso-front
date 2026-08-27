import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

  return <DashboardShell initialUser={null}>{children}</DashboardShell>;
}
